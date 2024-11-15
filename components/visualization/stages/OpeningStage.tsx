'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Options } from 'highcharts';

// Define types for our nodes and connections
type NodeType = {
  id: string;
  color: string;
  marker: { radius: number };
  mass: number;
};

type ConnectionType = [string, string];  // From node, To node

interface ChartComponentProps {
  options: Options;
}

const HighchartsComponent = dynamic(() => 
  import('highcharts/highstock').then(async (mod) => {
    const Highcharts = mod.default || mod;
    const networkgraph = await import('highcharts/modules/networkgraph');
    networkgraph.default(Highcharts);
    
    const Component = ({ options }: ChartComponentProps) => {
      const HighchartsReact = require('highcharts-react-official').default;
      return <HighchartsReact highcharts={Highcharts} options={options} />;
    };
    Component.displayName = 'HighchartsComponent';
    
    return Component;
  }),
  { ssr: false }
);

interface OpeningStageProps {
  progress: number;
  currentMessage?: string;
}

const OpeningStage: React.FC<OpeningStageProps> = ({ progress = 0, currentMessage = '' }) => {
  // Define node appearance based on message content
  const getVisibleNodes = (): NodeType[] => {
    const msg = currentMessage.toLowerCase();
    const nodes: NodeType[] = [];
    
    // Always show Para node
    nodes.push({
      id: 'Para',
      color: '#2563eb',
      marker: { radius: 60 },
      mass: 8
    });

    // Add nodes based on message content
    if (msg.includes('unique idea') || progress > 0.1) {
      nodes.push({
        id: 'Unique Idea',
        color: '#3b82f6',
        marker: { radius: 40 },
        mass: 4
      });
    }
    
    if (msg.includes('execution') || progress > 0.15) {
      nodes.push({
        id: 'Great Execution',
        color: '#3b82f6',
        marker: { radius: 40 },
        mass: 4
      });
    }
    
    if (msg.includes('technical') || progress > 0.2) {
      nodes.push({
        id: 'Technical Skills',
        color: '#3b82f6',
        marker: { radius: 40 },
        mass: 4
      });
    }
    
    if (msg.includes('story') || progress > 0.25) {
      nodes.push({
        id: 'Compelling Story',
        color: '#3b82f6',
        marker: { radius: 40 },
        mass: 4
      });
    }

    return nodes;
  };

  // Get connections based on visible nodes
  const getConnections = (): ConnectionType[] => {
    const nodes = getVisibleNodes();
    const connections: ConnectionType[] = [];
    
    // Create connections for each visible node to Para
    nodes.forEach(node => {
      if (node.id !== 'Para') {
        connections.push(['Para', node.id]);
      }
    });

    return connections;
  };

  const options: Options = {
    chart: {
      type: 'networkgraph',
      height: '400px',
      backgroundColor: 'transparent',
      animation: {
        duration: 1000
      }
    },
    title: {
      text: 'Building Para',
      style: {
        color: '#ffffff'
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      networkgraph: {
        layoutAlgorithm: {
          enableSimulation: true,
          integration: 'verlet',
          gravitationalConstant: 0.8,
          initialPositionRadius: 100,
          friction: -0.9,
          maxIterations: 300,
          linkLength: 300
        },
        draggable: true,
        link: {
          color: '#60a5fa',
          width: 2,
          opacity: 0.6
        }
      }
    },
    series: [{
      type: 'networkgraph',
      dataLabels: {
        enabled: true,
        style: {
          textOutline: 'none',
          color: '#ffffff'
        }
      },
      data: getConnections(),
      nodes: getVisibleNodes(),
      animation: {
        duration: 1000
      }
    }] as any  // Type assertion needed for Highcharts series
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-blue-900 rounded-lg p-6">
      <div className="w-full h-[400px]">
        <HighchartsComponent options={options} />
      </div>
    </div>
  );
};

OpeningStage.displayName = 'OpeningStage';

export default OpeningStage;