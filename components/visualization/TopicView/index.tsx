import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { topicConfig } from '../shared/TopicConfig';
import type {
  TopicNode,
  ExplicitConnection,
  ImplicitConnection,
} from '@/lib/types/transcript';
import { sampleNodes, explicitConnections, implicitConnections } from '@/data/samples/final-topics';
import { isExplicitConnection, isImplicitConnection } from '@/lib/types/transcript';

// D3 imports
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum
} from 'd3-force';
import {
  select,
  Selection,
  BaseType
} from 'd3-selection';
import {
  zoom,
  ZoomBehavior,
  zoomIdentity
} from 'd3-zoom';
import {
  drag,
  DragBehavior
} from 'd3-drag';

// Type definitions
interface ForceNode extends SimulationNodeDatum, Omit<TopicNode, 'type'> {
  type: 'main' | 'subtopic';  // Restrict to only these two types
}
interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: ForceNode | string;  // Can be either string or ForceNode during simulation
  target: ForceNode | string;
  type: 'explicit' | 'implicit';
  speaker?: string;  // Optional for explicit connections
  content?: string;  // Optional for explicit connections
  // For implicit connections
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
  };
  position: {
    x: number;
    y: number;
  };
}

// Helper function to access node properties safely
const getNodeType = (node: ForceNode | string): 'main' | 'subtopic' | undefined => {
  if (typeof node === 'string') return undefined;
  return node.type === 'main' || node.type === 'subtopic' ? node.type : undefined;
};

const createTooltipContent = (connection: ForceLink): string => {
  if ('speaker' in connection) {
    return `
      <div class="p-2">
        <p class="text-sm text-white/90 font-medium">Contributed by</p>
        <p class="text-xs text-cyan-400 mt-1">${connection.speaker}</p>
        ${connection.content ?
        `<p class="text-xs text-slate-300 mt-2">${connection.content}</p>`
        : ''
      }
      </div>
    `;
  }
  return `
    <div class="p-2">
      <p class="text-xs text-slate-300">Topic connection</p>
    </div>
  `;
};

// For the connections issue, we need to safely get the ID
const getNodeId = (node: ForceNode | string): string => {
  return typeof node === 'string' ? node : node.id;
};

const adjustColor = (baseColor: string, level: number): string => {
  return baseColor;
};

const TopicView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<ExpandedState>({});
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Modify node click handler
  const handleNodeClick = (node: ForceNode) => {
    // Check if node has children
    const hasChildren = sampleNodes.some(n => n.parentId === node.id);

    if (hasChildren) {
      setExpandedNodes(prev => ({
        ...prev,
        [node.id]: !prev[node.id]
      }));
    } else {
      // Handle leaf node click - could show details modal
      console.log('Leaf node clicked:', node);
    }
  };

  // Get visible nodes based on expansion state
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


  // Add refs to store simulation and transform state
  const simulationRef = useRef<any>(null);
  const transformRef = useRef<any>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    select("body").selectAll(".topic-tooltip-container").remove();


    // SVG setup
    const width = 1200;
    const height = 800;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    // Create SVG groups
    const g = svg.append("g");
    const linksGroup = g.append("g").attr("class", "links");
    const nodesGroup = g.append("g").attr("class", "nodes");

    // Zoom behavior
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);
    svg.call(zoomBehavior.transform, zoomIdentity);

    // Define type for initial positions
    type MainNodeId = 'TECHNOLOGY' | 'UX' | 'VISION' | 'PLANNING';
    type InitialPositions = Record<MainNodeId, { x: number; y: number }>;

    // Add fixed initial positions for main nodes
    const initialPositions: InitialPositions = {
      'TECHNOLOGY': { x: width * 0.75, y: height * 0.25 },
      'UX': { x: width * 0.25, y: height * 0.75 },
      'VISION': { x: width * 0.75, y: height * 0.75 },
      'PLANNING': { x: width * 0.25, y: height * 0.25 }
    };

    const isMainNodeId = (id: string): id is MainNodeId => {
      return id in initialPositions;
    };

    // Modify node initialization
    const nodes: ForceNode[] = getVisibleNodes
      .filter((node): node is TopicNode & { type: 'main' | 'subtopic' } =>
        node.type === 'main' || node.type === 'subtopic'
      )
      .map(node => ({
        ...node,
        x: node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].x : undefined,
        y: node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].y : undefined,
        fx: node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].x : undefined,
        fy: node.type === 'main' && isMainNodeId(node.id) ? initialPositions[node.id].y : undefined
      }));

    // Prepare visible links
    const nodeIds = new Set(nodes.map(n => n.id));
    const links: ForceLink[] = [
      // Add parent-child connections
      ...nodes
        .filter(n => n.type === 'subtopic' && n.parentId)
        .map(n => ({
          source: n.parentId!,
          target: n.id,
          type: 'explicit' as const
        })),
      // Add existing explicit connections
      ...explicitConnections
        .filter(conn =>
          nodeIds.has(conn.source) && nodeIds.has(conn.target)
        )
        .map(conn => ({
          ...conn,
          source: conn.source,
          target: conn.target
        })),
      // Add implicit connections when showInsights is true
      ...(showInsights
        ? implicitConnections
          .filter(conn =>
            nodeIds.has(conn.source) && nodeIds.has(conn.target)
          )
          .map(conn => ({
            ...conn,
            source: conn.source,
            target: conn.target
          }))
        : [])
    ];

    // Modify force simulation parameters
    const getNodeLevel = (node: ForceNode): number => {
      let level = 0;
      let currentNode = node;
      while (currentNode.parentId) {
        level++;
        currentNode = sampleNodes.find(n => n.id === currentNode.parentId) as ForceNode;
      }
      return level;
    };

    // Modify force simulation
    const simulation = forceSimulation<ForceNode>(nodes)
      .force("link", forceLink<ForceNode, ForceLink>(links)
        .id(d => d.id)
        .distance(d => {
          const source = d.source as ForceNode;
          const target = d.target as ForceNode;
          // Shorter distances for parent-child
          if (source.parentId === target.id || target.parentId === source.id) {
            return 120;
          }
          // Adjust distance based on node levels
          const sourceLevel = getNodeLevel(source);
          const targetLevel = getNodeLevel(target);
          return 200 + Math.abs(sourceLevel - targetLevel) * 50;
        }))
      .force("charge", forceManyBody<ForceNode>().strength(d =>
        -1000 - getNodeLevel(d) * 200
      ))
      .force("collide", forceCollide<ForceNode>(d =>
        80 - getNodeLevel(d) * 10
      ));

    // Add alpha decay to reduce animation
    simulation.alphaDecay(0.1);

    // Update link creation in TopicView
    const link = linksGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", d => d.type === 'explicit' ? "#94a3b8" : "#22d3ee")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", d => d.type === 'implicit' ? "5,5" : "none")
      .attr("fill", "none")
      .attr("opacity", 0.6)
      .on("mouseover", (event, d) => {
        // Highlight connected nodes
        const sourceId = getNodeId(d.source);
        const targetId = getNodeId(d.target);

        node.style("opacity", n =>
          n.id === sourceId || n.id === targetId ? 1 : 0.3
        );
        link.style("opacity", l => l === d ? 1 : 0.1);

        // Show connection info
        select("body")
          .append("div")
          .attr("class",
            "absolute pointer-events-none bg-slate-800/90 p-3 rounded-lg " +
            "shadow-lg border border-slate-700/50 z-50"
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .html(d.type === 'explicit' ? `
    <div class="space-y-2">
      <p class="text-sm text-white/90 font-medium">Contributed by</p>
      <p class="text-xs text-cyan-400 mt-1">${d.speaker}</p>
      <p class="text-xs text-slate-300">
        ${d.content}
      </p>
    </div>
  ` : `
    <div class="space-y-2">
      <p class="text-sm text-white/90 font-medium">Hidden Connection</p>
      <p class="text-xs text-cyan-400">${(d as ImplicitConnection).insight}</p>
      <p class="text-xs text-slate-300 mt-1">
        ${(d as ImplicitConnection).importance}
      </p>
    </div>
  `);
      })
      .on("mouseout", () => {
        // Remove highlighting
        node.style("opacity", 1);
        link.style("opacity", 0.6);
        // Remove tooltip
        select("body").selectAll("div.absolute.pointer-events-none").remove();
      });


    // Create nodes with larger sizes
    const node = nodesGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, d) => handleNodeClick(d));

    // Node circles with larger radius
    node.append("circle")
      .attr("r", d => {
        const level = getNodeLevel(d);
        return Math.max(60 - level * 10, 30); // Decrease size with level
      })
      .attr("fill", d => {
        let color;
        if (d.type === 'main') {
          // For main nodes, use their own color
          color = topicConfig[d.topicKey]?.color ?? '#94a3b8';
        } else {
          // For subtopics, traverse up to find main topic
          const findMainTopic = (node: ForceNode): string => {
            const parent = nodes.find(n => n.id === node.parentId);
            if (!parent) return 'OTHER';
            if (parent.type === 'main') return parent.topicKey;
            return findMainTopic(parent);
          };
          const mainTopic = findMainTopic(d);
          color = topicConfig[mainTopic]?.color ?? '#94a3b8';
        }

        const level = getNodeLevel(d);
        return level === 0 ? color : adjustColor(color, level);
      });

    // Node labels with larger font
    node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .attr("font-size", d => d.type === 'main' ? "16px" : "14px") // Increased font sizes
      .attr("font-weight", "500")
      .attr("pointer-events", "none");
    // .call(wrap, 120); // Wrap text if needed

    // Add drag behavior
    const dragBehavior = drag<SVGGElement, ForceNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(dragBehavior);

    // Add to node creation in TopicView
    node
      .on("mouseover", (event, d) => {
        const connectedNodes = new Set<string>();
        links.forEach(link => {
          const sourceId = getNodeId(link.source);
          const targetId = getNodeId(link.target);
          if (sourceId === d.id) connectedNodes.add(targetId);
          if (targetId === d.id) connectedNodes.add(sourceId);
        });
        // Highlight node and connections
        node.style("opacity", n =>
          n.id === d.id || connectedNodes.has(n.id) ? 1 : 0.3
        );
        link.style("opacity", l => {
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
        // Clear highlights
        node.style("opacity", 1);
        link.style("opacity", 0.6);
        // Make sure to clear tooltip
        setTooltip(null);
      });

    // Update positions
    simulation.on("tick", () => {
      link.attr("d", d => {
        const sourceNode = (typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source) as ForceNode;
        const targetNode = (typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target) as ForceNode;

        if (!sourceNode || !targetNode) return '';

        const dx = targetNode.x! - sourceNode.x!;
        const dy = targetNode.y! - sourceNode.y!;
        const dr = Math.sqrt(dx * dx + dy * dy);

        return `M ${sourceNode.x},${sourceNode.y} A ${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
      });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [expandedNodes, getVisibleNodes, showInsights],);

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
          onClick={() => {
            setShowInsights(!showInsights);
          }}
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
                opacity: tooltip ? 1 : 0,  // Add opacity transition
              }
              : {
                left: `${Math.min(tooltip.position.x + 10, window.innerWidth - 300)}px`,
                top: `${Math.min(tooltip.position.y - 10, window.innerHeight - 200)}px`,
              }
            )
          }}
        >
          <div className="space-y-2">
            <p className="text-sm text-white/90 font-medium">
              {tooltip.content.title}
            </p>
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
          </div>
        </div>
      )}
    </Card>
  );
};

export default TopicView;