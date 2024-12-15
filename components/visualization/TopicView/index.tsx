import React, { useState, useRef, useEffect } from 'react';
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
import { sampleNodes, explicitConnections, implicitConnections } from '@/data/samples/final-topics';

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
}

// Helper function to access node properties safely
const getNodeType = (node: ForceNode | string): 'main' | 'subtopic' | undefined => {
  if (typeof node === 'string') return undefined;
  return node.type === 'main' || node.type === 'subtopic' ? node.type : undefined;
};

// For the connections issue, we need to safely get the ID
const getNodeId = (node: ForceNode | string): string => {
  return typeof node === 'string' ? node : node.id;
};

const TopicView: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [showSpeakers, setShowSpeakers] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TopicNode | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

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

    // Prepare data
    const nodes: ForceNode[] = sampleNodes
      .filter((node): node is TopicNode & { type: 'main' | 'subtopic' } =>
        node.type === 'main' || node.type === 'subtopic'
      )
      .map(node => ({
        ...node,
        x: undefined,
        y: undefined
      }));

    const links: ForceLink[] = [
      ...explicitConnections.map(conn => ({
        ...conn,
        source: conn.source,
        target: conn.target
      })),
      ...implicitConnections.map(conn => ({
        ...conn,
        source: conn.source,
        target: conn.target
      }))
    ];

    // Create force simulation
    const simulation = forceSimulation<ForceNode>(nodes)
      .force("link", forceLink<ForceNode, ForceLink>(links)
        .id(d => d.id)
        .distance((d: ForceLink) => {
          const sourceType = getNodeType(d.source);
          const targetType = getNodeType(d.target);
          if (sourceType === 'main' && targetType === 'subtopic') return 80;
          return 150;
        })
      )
      .force("charge", forceManyBody().strength(-1000))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide(60));

    // Create links
    const link = linksGroup
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", d => d.type === 'explicit' ? '#94a3b8' : '#22d3ee')
      .attr("stroke-width", d => d.type === 'explicit' ? 2 : 1.5)
      .attr("stroke-dasharray", d => d.type === 'implicit' ? "5,5" : "none")
      .attr("fill", "none")
      .attr("opacity", 0.6);

    // Create nodes
    const node = nodesGroup
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    // Node circles
    node.append("circle")
      .attr("r", d => d.type === 'main' ? 40 : 25)
      .attr("fill", d => {
        const mainTopic = d.type === 'main' ? d.topicKey : d.parentId;
        return mainTopic ? topicConfig[mainTopic].color : '#94a3b8';
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Node labels
    node.append("text")
      .text(d => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .attr("fill", "white")
      .attr("font-size", d => d.type === 'main' ? "14px" : "12px")
      .attr("font-weight", "500")
      .attr("pointer-events", "none");

    // Drag behavior
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

    // Hover interactions
    node
      .on("mouseover", (event, d) => {
        const connectedNodes = new Set<string>();
        links.forEach(link => {
          const sourceId = getNodeId(link.source);
          const targetId = getNodeId(link.target);
          if (sourceId === d.id) connectedNodes.add(targetId);
          if (targetId === d.id) connectedNodes.add(sourceId);
        });

        node.style("opacity", n =>
          connectedNodes.has(n.id) || n.id === d.id ? 1 : 0.3
        );
        link.style("opacity", l => {
          const sourceId = getNodeId(l.source);
          const targetId = getNodeId(l.target);
          return sourceId === d.id || targetId === d.id ? 1 : 0.1;
        });
      })
      .on("mouseout", () => {
        node.style("opacity", 1);
        link.style("opacity", 0.6);
      });

    // Link hover interactions
    link
      .on("mouseover", (event, d) => {
        setHoveredConnection(`${d.source}-${d.target}`);
      })
      .on("mouseout", () => {
        setHoveredConnection(null);
      });

    // Update positions with proper typing
    simulation.on("tick", () => {
      link.attr("d", (d: ForceLink) => {
        // Safe type casting with runtime checks
        const sourceNode = (typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source) as ForceNode;
        const targetNode = (typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target) as ForceNode;

        if (!sourceNode || !targetNode) return '';

        const dx = targetNode.x! - sourceNode.x!;
        const dy = targetNode.y! - sourceNode.y!;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate curve
        const curvature = Math.min(0.3, 100 / distance);
        const midX = (sourceNode.x! + targetNode.x!) / 2;
        const midY = (sourceNode.y! + targetNode.y!) / 2 - distance * curvature;

        return `M ${sourceNode.x},${sourceNode.y} Q ${midX},${midY} ${targetNode.x},${targetNode.y}`;
      });

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [showSpeakers, showInsights]);

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
    </Card>
  );
};

export default TopicView;