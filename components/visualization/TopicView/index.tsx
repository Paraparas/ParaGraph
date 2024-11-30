import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { topicConfig } from '../shared/TopicConfig';
import type { 
    TopicNode, 
    TopicConnection, 
    ExplicitConnection, 
    ImplicitConnection 
  } from '@/lib/types/transcript';
  import { isExplicitConnection, isImplicitConnection } from '@/lib/types/transcript';

import { sampleNodes, explicitConnections, implicitConnections } from '@/data/samples/test-meeting-topics';

const TopicView = () => {
    const [showSpeakers, setShowSpeakers] = useState(false);
    const [showInsights, setShowInsights] = useState(false);
    const [activeInsightIndex, setActiveInsightIndex] = useState(-1);
    const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const calculateConnectionPath = (source: { x: number; y: number }, target: { x: number; y: number }) => {
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const curvature = Math.min(0.3, 100 / distance);
        
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2 - distance * curvature;
        
        return {
          path: `M ${source.x},${source.y} Q ${midX},${midY} ${target.x},${target.y}`,
          labelPosition: { x: midX, y: midY }
        };
      };

  // Calculate node positions
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    
    // Get viewport dimensions from viewBox
    const viewportWidth = 1200;
    const viewportHeight = 800;
    
    // Calculate safe area margins to keep nodes and text visible
    const margin = 100; // Space for node radius + text + padding
    const safeWidth = viewportWidth - 2 * margin;
    const safeHeight = viewportHeight - 2 * margin;
    
    // Center point
    const centerX = viewportWidth / 2;
    const centerY = viewportHeight / 2;
    
    // Adjust radius based on safe area
    const mainRadius = Math.min(safeWidth, safeHeight) * 0.35; // Reduced from previous value
    const subtopicRadius = mainRadius * 0.7; // Proportional to main radius
  
    // Position main topics in a circle
    const mainTopics = sampleNodes.filter(node => node.type === 'main');
    mainTopics.forEach((node, index) => {
      // Start angle from top (-π/2) and go clockwise
      const angle = -Math.PI/2 + (index / mainTopics.length) * 2 * Math.PI;
      positions[node.id] = {
        x: centerX + Math.cos(angle) * mainRadius,
        y: centerY + Math.sin(angle) * mainRadius
      };
    });
  
    // Position subtopics around their parent with boundary checking
    sampleNodes.filter(node => node.type === 'subtopic').forEach(node => {
      const parentPos = positions[node.parentId!];
      if (!parentPos) return;
  
      // Find siblings
      const siblings = sampleNodes.filter(n => 
        n.type === 'subtopic' && n.parentId === node.parentId
      );
      const siblingIndex = siblings.findIndex(n => n.id === node.id);
      const totalSiblings = siblings.length;
  
      // Calculate arc range for subtopics (avoid overlap with other main nodes)
      const arcRange = Math.PI * 0.8; // 108 degrees
      const startAngle = -arcRange / 2;
      
      // Calculate angle to parent node from center
      const parentAngle = Math.atan2(
        parentPos.y - centerY,
        parentPos.x - centerX
      );
  
      // Calculate position relative to parent
      const angleOffset = startAngle + (siblingIndex / (totalSiblings - 1 || 1)) * arcRange;
      const finalAngle = parentAngle + angleOffset;
  
      // Calculate initial position
      let x = parentPos.x + Math.cos(finalAngle) * subtopicRadius;
      let y = parentPos.y + Math.sin(finalAngle) * subtopicRadius;
  
      // Ensure position is within bounds
      x = Math.max(margin, Math.min(viewportWidth - margin, x));
      y = Math.max(margin, Math.min(viewportHeight - margin, y));
  
      positions[node.id] = { x, y };
    });
  
    return positions;
  }, []);

  // Helper function to get color based on topicKey
  const getTopicColor = (node: TopicNode): string => {
    const mainTopic = node.type === 'main' ? node.topicKey : node.parentId;
    return mainTopic ? topicConfig[mainTopic].color : '#94a3b8';
  };

  const speakerStyles = {
    'Kinan': {
      bgClass: 'stroke-emerald-500/30 stroke-2',
      textClass: 'font-semibold tracking-wide'
    },
    'Ewa': {
      bgClass: 'stroke-pink-500/30 stroke-2',
      textClass: 'font-medium tracking-normal'
    },
    'Qi': {
      bgClass: 'stroke-purple-500/30 stroke-2',
      textClass: 'font-bold tracking-tight'
    },
    'Muhammad': {
      bgClass: 'stroke-amber-500/30 stroke-2',
      textClass: 'font-normal tracking-wider'
    }
  };

    // Handle insight revelation
    React.useEffect(() => {
        if (showInsights && activeInsightIndex < implicitConnections.length - 1) {
        const timer = setTimeout(() => {
            setActiveInsightIndex(prev => prev + 1);
        }, 1000); // Reveal one insight every second
        return () => clearTimeout(timer);
        }
    }, [showInsights, activeInsightIndex]);

    return (
        <Card className="w-full min-h-screen bg-slate-900">
          <div className="flex justify-between p-4">
            <Button
              variant={showSpeakers ? 'default' : 'outline'}
              onClick={() => setShowSpeakers(!showSpeakers)}
            >
              {showSpeakers ? 'Hide Speakers' : 'Show Speakers'}
            </Button>
            <Button
              variant={showInsights ? 'default' : 'outline'}
              onClick={() => {
                setShowInsights(!showInsights);
                if (!showInsights) {
                  setActiveInsightIndex(0); // Start revealing insights
                } else {
                  setActiveInsightIndex(-1); // Reset insights
                }
              }}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {showInsights ? 'Hide Insights' : 'Discover Insights'}
            </Button>
          </div>
    
          <div className="w-full h-[calc(100vh-100px)] overflow-hidden">
            <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
              {/* Explicit Connections */}
              {explicitConnections.map((conn, idx) => {
                const source = nodePositions[conn.source];
                const target = nodePositions[conn.target];
                if (!source || !target) return null;
    
                const { path, labelPosition } = calculateConnectionPath(source, target);
    
                return (
                    <g key={`explicit-${idx}`}>
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        d={path}
                        stroke="#94a3b8"
                        strokeWidth={2}
                        fill="none"
                      />
                      {showSpeakers && isExplicitConnection(conn) && conn.speaker && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {/* Calculate the offset based on the connection angle */}
                            {(() => {
                            const dx = target.x - source.x;
                            const dy = target.y - source.y;
                            const angle = Math.atan2(dy, dx);
                            
                            // Offset the label perpendicular to the connection line
                            const offset = 25; // Adjust this value to move labels further from the line
                            const offsetX = Math.sin(angle) * offset;
                            const offsetY = -Math.cos(angle) * offset;
                            
                            const labelX = labelPosition.x + offsetX;
                            const labelY = labelPosition.y + offsetY;
                            
                            return (
                                <>
                                {/* Speaker label container */}
                                <motion.g
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", stiffness: 100 }}
                                >
                                    {/* Background */}
                                    <rect
                                    x={labelX - 35}
                                    y={labelY - 10}
                                    width="70"
                                    height="20"
                                    rx="4"
                                    fill="#1e293b"  // Dark background
                                    className={`${speakerStyles[conn.speaker].bgClass} shadow-sm`}
                                    />
                                    {/* Speaker name */}
                                    <text
                                    x={labelX}
                                    y={labelY + 4}
                                    textAnchor="middle"
                                    fill="white"
                                    className={`text-xs font-inter ${speakerStyles[conn.speaker].textClass}`}
                                    >
                                    {conn.speaker}
                                    </text>
                                </motion.g>
                                </>
                            );
                            })()}
                        </motion.g>
                        )}
                    </g>
                  );
              })}
    
              {/* Implicit Connections */}
              <AnimatePresence>
              {showInsights && implicitConnections.slice(0, activeInsightIndex + 1).map((conn, idx) => {
                const source = nodePositions[conn.source];
                const target = nodePositions[conn.target];
                if (!source || !target) return null;

                const { path, labelPosition } = calculateConnectionPath(source, target);
                const connectionId = `implicit-${idx}`;

                return (
                    <g 
                    key={connectionId}
                    onMouseEnter={() => {
                        console.log('Hovering connection:', connectionId, conn); // Enhanced debugging
                        setHoveredConnection(connectionId);
                    }}
                    onMouseLeave={() => {
                        console.log('Leaving connection:', connectionId); // Added debug
                        setHoveredConnection(null);
                    }}
                    >
                    {/* Add a transparent hit area for better hover detection */}
                    <path
                        d={path}
                        stroke="transparent"
                        strokeWidth={20}
                        fill="none"
                        style={{ cursor: 'pointer' }}
                    />
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        d={path}
                        stroke="#22d3ee"
                        strokeWidth={2.5}
                        strokeDasharray="5,5"
                        fill="none"
                    />
                      {hoveredConnection === connectionId && isImplicitConnection(conn) && (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <text
                            id={`measure-${connectionId}`}
                            className="text-xs"
                            style={{ visibility: 'hidden' }}
                            >
                                {conn.insight}
                            </text>
                            <foreignObject
                            x={labelPosition.x - 200} // Wider than before
                            y={labelPosition.y - 60}
                            width="400" // Increased width
                            height="auto" // Increased height
                            style={{ overflow: 'visible' }} // Allow content to determine size
                            >
                            <div className="bg-slate-800/90 p-3 rounded-lg shadow-lg border border-cyan-500/20">
                                <p className="text-xs text-white/90 leading-relaxed max-w-[280px] font-inter tracking-tight">
                                {conn.insight}
                                </p>
                                {conn.importance && (
                                <p className="text-xs text-cyan-400/80 mt-1 font-inter font-medium tracking-tight">
                                    {conn.importance}
                                </p>
                                )}
                            </div>
                            </foreignObject>
                        </motion.g>
                      )}
                    </g>
                  );
                })}
              </AnimatePresence>

          {/* Nodes */}
          {sampleNodes.map(node => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            // Calculate text dimensions and adjust node size
            const words = node.label.split(' ');
            const isMainNode = node.type === 'main';
            const baseRadius = isMainNode ? 40 : 25;
            const fontSize = isMainNode ? 14 : 12;
            
            // Split text into lines if too long
            const maxCharsPerLine = isMainNode ? 15 : 12;
            const lines = words.reduce((acc: string[], word) => {
                const currentLine = acc[acc.length - 1];
                if (!currentLine || (currentLine + ' ' + word).length > maxCharsPerLine) {
                acc.push(word);
                } else {
                acc[acc.length - 1] = currentLine + ' ' + word;
                }
                return acc;
            }, []);

            // Adjust circle size based on text
            const radius = Math.max(baseRadius, 
                (lines.length > 1 ? baseRadius * 1.2 : baseRadius)
            );

            return (
                <g key={node.id}>
                  {/* Background circle for better text contrast */}
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ r: radius + 2, opacity: 0.3 }}
                    cx={pos.x}
                    cy={pos.y}
                    fill="#000000"
                    className="cursor-pointer"
                  />
                  
                  {/* Main node circle */}
                  <motion.circle
                    initial={{ r: 0 }}
                    animate={{ 
                      r: radius,
                      opacity: selectedTopic ? (selectedTopic === node.id || selectedTopic === node.parentId ? 0.8 : 0.3) : 0.8
                    }}
                    cx={pos.x}
                    cy={pos.y}
                    fill={getTopicColor(node)}
                    className="cursor-pointer hover:opacity-100"
                    onClick={() => node.type === 'main' && setSelectedTopic(
                      selectedTopic === node.id ? null : node.id
                    )}
                  />
                  
                  {/* Multi-line text */}
                  <g>
                    {lines.map((line, i) => (
                      <text
                        key={`${node.id}-line-${i}`}
                        x={pos.x}
                        y={pos.y + (i - (lines.length - 1) / 2) * (fontSize + 2)}
                        textAnchor="middle"
                        dy=".3em"
                        fill="white"
                        fontSize={fontSize}
                        className="font-inter font-medium select-none tracking-tight"
                      >
                        <tspan className="bg-opacity-50 px-1 rounded">
                          {line}
                        </tspan>
                      </text>
                    ))}
                  </g>
                </g>
              );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default TopicView;