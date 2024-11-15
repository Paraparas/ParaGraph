'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Options } from 'highcharts';

// Extend Highcharts types for networkgraph nodes
interface ExtendedNodeOptions {
  id: string;
  color: string;
  marker?: {
    radius: number;
  };
  x?: number;
  y?: number;
  fixed?: boolean;
}

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
}

const OpeningStage: React.FC<OpeningStageProps> = ({ progress = 0 }) => {
  // Define nodes using our extended type
  const nodes: ExtendedNodeOptions[] = [
    { 
      id: 'Para',
      color: '#2563eb',
      marker: {
        radius: 40
      },
      x: 200,
      y: 200,
      fixed: true
    },
    {
      id: 'Unique Idea',
      color: '#3b82f6',
      marker: {
        radius: 35
      },
      x: 100,
      y: 100,
      fixed: true
    },
    {
      id: 'Great Execution',
      color: '#3b82f6',
      marker: {
        radius: 35
      },
      x: 300,
      y: 100,
      fixed: true
    },
    {
      id: 'Technical Skills',
      color: '#3b82f6',
      marker: {
        radius: 35
      },
      x: 100,
      y: 300,
      fixed: true
    },
    {
      id: 'Compelling Story',
      color: '#3b82f6',
      marker: {
        radius: 35
      },
      x: 300,
      y: 300,
      fixed: true
    }
  ];

  const connections = [
    ['Para', 'Unique Idea'],
    ['Para', 'Great Execution'],
    ['Para', 'Technical Skills'],
    ['Para', 'Compelling Story']
  ].slice(0, Math.max(1, Math.ceil(progress * 4)));

  // Cast the options to avoid TypeScript errors
  const options: Options = {
    chart: {
      type: 'networkgraph',
      height: '400px',
      backgroundColor: 'transparent'
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
          enableSimulation: false,
          friction: -0.9
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
      data: connections,
      nodes: nodes
    } as any] // Use type assertion here
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