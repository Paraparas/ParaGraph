import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { topicConfig } from '../shared/TopicConfig';
import type {
  TopicNode,
  ExplicitConnection,
  ImplicitConnection,
  TopicSummary
} from '@/lib/types/transcript';
import { sampleNodes, explicitConnections, implicitConnections } from '@/data/samples/final-topics';

// D3 imports
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY,
  SimulationNodeDatum,
  Simulation
} from 'd3-force';
import { select, Selection } from 'd3-selection';
import { zoom, ZoomTransform, zoomIdentity } from 'd3-zoom';
import { drag } from 'd3-drag';

// D3 Selection Types
type D3Selection<Element extends SVGElement> = Selection<Element, unknown, null, undefined>;
type NodeSelection = D3Selection<SVGGElement>;
type LinkSelection = D3Selection<SVGPathElement>;

// Component Types
interface ForceNode extends SimulationNodeDatum {
  id: string;
  label: string;
  type: 'main' | 'subtopic';
  topicKey: string;
  parentId?: string;
  summary?: TopicSummary;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface ForceLink {
  source: string;
  target: string;
  type: 'explicit' | 'implicit';
  speaker?: string;
  content?: string;
  insight?: string;
  importance?: string;
}

interface ExpandedState {
  [key: string]: boolean;
}

interface TooltipData {
  type: 'node' | 'link';
  content: {
    title: string;
    description?: string;
    details?: string[];
    speakers?: string[];
    timestamp?: string;
    insight?: string;
    importance?: string[];
  };
  position: {
    x: number;
    y: number;
  };
}

const TopicView: React.FC = () => {
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<Simulation<ForceNode, ForceLink> | null>(null);
  const transformRef = useRef<ZoomTransform | null>(null);
  const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  // State
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<ExpandedState>({});
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Helper Functions
  const getNodeId = (node: ForceNode | string): string => {
    return typeof node === 'string' ? node : node.id;
  };

  const getNodeLevel = (node: ForceNode): number => {
    let level = 0;
    let currentNode = node;
    while (currentNode.parentId) {
      level++;
      currentNode = sampleNodes.find(n => n.id === currentNode.parentId) as ForceNode;
    }
    return level;
  };

  const adjustColor = (baseColor: string, level: number): string => {
    // Simple lightening based on level
    const lightenAmount = Math.min(level * 0.1, 0.3); // Max 30% lighter
    return baseColor.replace('rgb', 'rgba').replace(')', `, ${1 - lightenAmount})`);
  };

  const handleNodeClick = (node: ForceNode) => {
    const hasChildren = sampleNodes.some(n => n.parentId === node.id);
    if (hasChildren) {
      setExpandedNodes(prev => ({
        ...prev,
        [node.id]: !prev[node.id]
      }));
    }
  };

  // Memoized visible nodes calculation
  const getVisibleNodes = useMemo(() => {
    const mainNodes = sampleNodes.filter(node => node.type === 'main');
    if (Object.keys(expandedNodes).length === 0) return mainNodes;

    const visibleNodeIds = new Set(mainNodes.map(n => n.id));
    const processNode = (nodeId: string) => {
      if (expandedNodes[nodeId]) {
        const children = sampleNodes.filter(n => n.parentId === nodeId);
        children.forEach(child => {
          visibleNodeIds.add(child.id);
          processNode(child.id);
        });
      }
    };

    mainNodes.forEach(node => processNode(node.id));
    return sampleNodes.filter(node => visibleNodeIds.has(node.id));
  }, [expandedNodes]);

  // Initial positions configuration
  const width = 1200;
  const height = 800;
  type MainNodeId = 'TECHNOLOGY' | 'UX' | 'VISION' | 'PLANNING';

  const initialPositions: Record<MainNodeId, { x: number; y: number }> = {
    'TECHNOLOGY': { x: width * 0.75, y: height * 0.25 },
    'UX': { x: width * 0.25, y: height * 0.75 },
    'VISION': { x: width * 0.75, y: height * 0.75 },
    'PLANNING': { x: width * 0.25, y: height * 0.25 }
  };

  const isMainNodeId = (id: string): id is MainNodeId => {
    return id in initialPositions;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Get or create SVG elements
    let svg: D3Selection<SVGSVGElement>;
    let g: D3Selection<SVGGElement>;
    let linksGroup: D3Selection<SVGGElement>;
    let nodesGroup: D3Selection<SVGGElement>;

    if (!simulationRef.current) {
      // First time setup
      svg = select(svgRef.current);
      svg.selectAll("*").remove();
      g = svg.append("g");
      linksGroup = g.append("g").attr("class", "links");
      nodesGroup = g.append("g").attr("class", "nodes");

      // Setup zoom behavior
      const zoomBehavior = zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 2])
        .on("zoom", (event) => {
          transformRef.current = event.transform;
          g.attr("transform", event.transform);
        });

      svg.call(zoomBehavior);

      // Initialize or restore transform
      if (!transformRef.current) {
        svg.call(zoomBehavior.transform, zoomIdentity);
      } else {
        svg.call(zoomBehavior.transform, transformRef.current);
      }
    } else {
      // Get existing elements
      svg = select(svgRef.current);
      g = svg.select("g");
      linksGroup = g.select(".links");
      nodesGroup = g.select(".nodes");
    }

    // Prepare nodes data
    const nodes: ForceNode[] = getVisibleNodes
      .filter((node): node is TopicNode & { type: 'main' | 'subtopic' } =>
        node.type === 'main' || node.type === 'subtopic'
      )
      .map(node => ({
        ...node,
        // Use stored position if available, otherwise use initial position for main nodes
        x: nodePositionsRef.current[node.id]?.x ||
          (node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].x : undefined),
        y: nodePositionsRef.current[node.id]?.y ||
          (node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].y : undefined),
        fx: node.type === 'main' ?
          (nodePositionsRef.current[node.id]?.x ||
            (isMainNodeId(node.id) ? initialPositions[node.id].x : undefined)) :
          undefined,
        fy: node.type === 'main' ?
          (nodePositionsRef.current[node.id]?.y ||
            (isMainNodeId(node.id) ? initialPositions[node.id].y : undefined)) :
          undefined
      }));

    // Prepare links data
    const nodeIds = new Set(nodes.map(n => n.id));
    const links: ForceLink[] = [
      // Parent-child connections
      ...nodes
        .filter(n => n.type === 'subtopic' && n.parentId)
        .map(n => ({
          source: n.parentId!,
          target: n.id,
          type: 'explicit' as const
        })),
      // Explicit connections
      ...explicitConnections
        .filter(conn => nodeIds.has(conn.source) && nodeIds.has(conn.target))
        .map(conn => ({
          ...conn,
          source: conn.source,
          target: conn.target
        })),
      // Implicit connections when enabled
      ...(showInsights
        ? implicitConnections
          .filter(conn => nodeIds.has(conn.source) && nodeIds.has(conn.target))
          .map(conn => ({
            ...conn,
            source: conn.source,
            target: conn.target
          }))
        : [])
    ];

    // Update or create simulation
    if (!simulationRef.current) {
      simulationRef.current = forceSimulation<ForceNode>(nodes)
        .force("link", forceLink<ForceNode, ForceLink>(links)
          .id(d => d.id)
          .distance(d => {
            const sourceNode = (typeof d.source === 'string'
              ? nodes.find(n => n.id === d.source)
              : d.source) as ForceNode;

            const targetNode = (typeof d.target === 'string'
              ? nodes.find(n => n.id === d.target)
              : d.target) as ForceNode;

            if (sourceNode.parentId === targetNode.id || targetNode.parentId === sourceNode.id) {
              return 150; // Increased parent-child distance
            }
            const sourceLevel = getNodeLevel(sourceNode);
            const targetLevel = getNodeLevel(targetNode);
            return 250 + Math.abs(sourceLevel - targetLevel) * 30; // More gentle scaling
          }))
        .force("charge", forceManyBody<ForceNode>()
          .strength(d => -600 - getNodeLevel(d) * 100)) // Reduced repulsion
        .force("collide", forceCollide<ForceNode>(d =>
          100 - getNodeLevel(d) * 5)) // More space between nodes
        .force("x", forceX<ForceNode>(width / 2).strength(0.03)) // Very gentle centering
        .force("y", forceY<ForceNode>(height / 2).strength(0.03))
        .alphaDecay(0.01) // Even slower decay
        .velocityDecay(0.5); // More damping for smoother movement
    } else {
      // Update existing simulation more gently
      simulationRef.current
        .nodes(nodes);

      const linkForce = simulationRef.current.force<any>("link");
      if (linkForce) {
        linkForce.links(links);
      }

      simulationRef.current
        .alpha(0.3) // Lower alpha for more gentle transitions
        .alphaTarget(0.005) // Slightly above zero to maintain some movement
        .restart();

      // Gradually return to zero after a delay
      setTimeout(() => {
        if (simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
      }, 3000); // 3 seconds of gentle movement
    }

    // Update links
    const linkSelection = linksGroup.selectAll<SVGPathElement, ForceLink>("path").data(links);
    linkSelection.exit().remove();

    const linkEnter = linkSelection.enter().append("path");
    const linkUpdate = linkEnter.merge(linkSelection)
    .attr("class", "link")
    .attr("stroke", d => d.type === 'explicit' ? "#94a3b8" : "#22d3ee")
    .attr("stroke-width", d => d.type === 'explicit' ? 3 : 5) // Thicker for implicit links
    .attr("stroke-dasharray", d => d.type === 'implicit' ? "8,4" : "none") // Also adjusted dash pattern
    .attr("fill", "none")
    .attr("opacity", 0.6)
    .on("mouseover", (event, d) => {
        // Highlight connected nodes
        const sourceId = getNodeId(d.source);
        const targetId = getNodeId(d.target);

        nodeUpdate.style("opacity", n =>
            n.id === sourceId || n.id === targetId ? 1 : 0.3
        );
        linkUpdate.style("opacity", l => l === d ? 1 : 0.1);

        // Show tooltip
        if (d.type === 'explicit') {
            setTooltip({
                type: 'link',
                content: {
                    title: 'Contributed by',
                    description: d.content,
                    speakers: [d.speaker!],
                },
                position: {
                    x: event.pageX,
                    y: event.pageY
                }
            });
        } else {
            setTooltip({
                type: 'link',
                content: {
                    title: 'Hidden Connection',
                    insight: (d as ImplicitConnection).insight,
                    importance: [(d as ImplicitConnection).importance],
                },
                position: {
                    x: event.pageX,
                    y: event.pageY
                }
            });
        }
    })
    .on("mouseout", () => {
        nodeUpdate.style("opacity", 1);
        linkUpdate.style("opacity", 0.6);
        setTooltip(null);
    });

    // Update nodes
    const nodeSelection = nodesGroup.selectAll<SVGGElement, ForceNode>("g").data(nodes);
    nodeSelection.exit().remove();

    const nodeEnter = nodeSelection.enter().append("g")
      .attr("class", "node")
      .on("click", (event, d) => handleNodeClick(d));

    nodeEnter.append("circle");
    nodeEnter.append("text");

    const nodeUpdate = nodeEnter.merge(nodeSelection);

    // Update node circles
    nodeUpdate.select("circle")
      .attr("r", d => {
        const level = getNodeLevel(d);
        return Math.max(60 - level * 10, 30);
      })
      .attr("fill", d => {
        // Traverse up to find main topic color
        const findMainTopicColor = (node: ForceNode): string => {
          if (node.type === 'main') {
            return topicConfig[node.topicKey]?.color ?? '#94a3b8';
          }
          const parent = nodes.find(n => n.id === node.parentId);
          if (!parent) return '#94a3b8';
          return findMainTopicColor(parent);
        };

        const color = findMainTopicColor(d);
        const level = getNodeLevel(d);

        // Optional: Lighten the color slightly for deeper levels
        return level === 0 ? color : adjustColor(color, level);
      });

    // Update node labels
    nodeUpdate.select("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .attr("font-size", d => d.type === 'main' ? "16px" : "14px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none");

    // Add interactions
    nodeUpdate
      .on("mouseover", (event, d) => {
        const connectedNodes = new Set<string>();
        links.forEach(link => {
          const sourceId = getNodeId(link.source);
          const targetId = getNodeId(link.target);
          if (sourceId === d.id) connectedNodes.add(targetId);
          if (targetId === d.id) connectedNodes.add(sourceId);
        });

        nodeUpdate.style("opacity", n =>
          n.id === d.id || connectedNodes.has(n.id) ? 1 : 0.3
        );
        linkUpdate.style("opacity", l => {
          const sourceId = getNodeId(l.source);
          const targetId = getNodeId(l.target);
          return sourceId === d.id || targetId === d.id ? 1 : 0.1;
        });

        if (d.summary) {
          setTooltip({
            type: 'node',
            content: {
              title: d.label,
              description: d.summary.brief,
              details: d.summary.details?.keyPoints,
              speakers: d.summary.details?.speakers,
              timestamp: d.summary.details?.timestamp
            },
            position: {
              x: event.pageX,
              y: event.pageY
            }
          });
        }
      })
      .on("mouseout", () => {
        nodeUpdate.style("opacity", 1);
        linkUpdate.style("opacity", 0.6);
        setTooltip(null);
      });

    // Add drag behavior
    const dragBehavior = drag<SVGGElement, ForceNode>()
      .on("start", (event, d) => {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
        if (d.type === 'main') {
          // Store position for main nodes
          nodePositionsRef.current[d.id] = { x: event.x, y: event.y };
          d.fx = event.x;
          d.fy = event.y;
        } else {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeUpdate.call(dragBehavior);

    // Update simulation
    simulationRef.current?.on("tick", () => {
      linkUpdate.attr("d", d => {
        const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source)! : d.source as ForceNode;
        const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target)! : d.target as ForceNode;

        const dx = target.x! - source.x!;
        const dy = target.y! - source.y!;
        const dr = Math.sqrt(dx * dx + dy * dy);

        return `M ${source.x},${source.y} A ${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      nodeUpdate.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      if (simulationRef.current) simulationRef.current.alphaTarget(0);
    };
  }, [expandedNodes, showInsights, getVisibleNodes]);

  return (
    <Card className="w-full min-h-screen bg-slate-900 relative">
      <div className="flex justify-between p-4">
        <Button
          variant={showSpeakers ? 'default' : 'outline'}
          onClick={() => setShowSpeakers(!showSpeakers)}
        >
          {showSpeakers ? 'Hide Speakers' : 'Show Speakers'}
        </Button>
        <Button
          variant={showInsights ? 'default' : 'outline'}
          onClick={() => setShowInsights(!showInsights)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {showInsights ? 'Hide Insights' : 'Discover Insights'}
        </Button>
      </div>
      <div className="w-full h-[calc(100vh-100px)] overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid meet"
        />
      </div>
      {tooltip && (
        <div
          className="fixed pointer-events-none bg-slate-800/90 p-3 rounded-lg 
                     shadow-lg border border-slate-700/50 z-50 max-w-xs
                     transition-all duration-200 ease-in-out"
          style={{
            ...(tooltip.type === 'node'
              ? {
                right: '1rem',
                top: '6rem',
                opacity: 1
              }
              : {
                left: `${Math.min(tooltip.position.x + 10, window.innerWidth - 300)}px`,
                top: `${Math.min(tooltip.position.y - 10, window.innerHeight - 200)}px`
              }
            )
          }}
        >
          <div className="space-y-2">
      <p className="text-sm text-white/90 font-medium">
        {tooltip.content.title}
      </p>
      {tooltip.type === 'link' ? (
        // Link tooltip content
        tooltip.content.speakers ? (
          // Explicit connection
          <>
            <p className="text-xs">
              <span className="text-cyan-400">{tooltip.content.speakers}</span>
            </p>
            {tooltip.content.description && (
              <p className="text-xs text-slate-300 mt-1">
                {tooltip.content.description}
              </p>
            )}
          </>
        ) : (
          // Implicit connection
          <>
            {tooltip.content.insight && (
              <p className="text-xs">
                <span className="text-purple-400 font-medium">Insight: </span>
                <span className="text-slate-300">{tooltip.content.insight}</span>
              </p>
            )}
            {tooltip.content.importance && (
              <p className="text-xs mt-2">
                <span className="text-amber-400 font-medium">Why Important: </span>
                <span className="text-slate-300">{tooltip.content.importance}</span>
              </p>
            )}
          </>
        )
      ) : (
        // Node tooltip content (existing)
        <>
          {tooltip.content.description && (
            <p className="text-xs text-slate-300">
              {tooltip.content.description}
            </p>
          )}
          {tooltip.content.details && (
            <div className="text-xs text-slate-300 space-y-1">
              {tooltip.content.details.map((detail, i) => (
                <p key={i}>• {detail}</p>
              ))}
            </div>
          )}
          {tooltip.content.speakers && (
            <div className="flex gap-1 mt-2">
              {tooltip.content.speakers.map((speaker, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-slate-700/50 rounded-full text-cyan-400"
                >
                  {speaker}
                </span>
              ))}
            </div>
          )}
          {tooltip.content.timestamp && (
            <p className="text-xs text-slate-400 mt-1">
              {tooltip.content.timestamp}
            </p>
          )}
        </>
      )}
    </div>
  </div>
)}
    </Card>
  );
};

export default TopicView;