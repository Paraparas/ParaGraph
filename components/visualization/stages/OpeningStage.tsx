'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Create a component that handles Highcharts initialization
const HighchartsComponent = dynamic(() => 
  import('highcharts/highstock').then(async (mod) => {
    // Get the base Highcharts
    const Highcharts = mod.default;
    
    // Import and initialize networkgraph module
    const networkgraph = await import('highcharts/modules/networkgraph');
    networkgraph.default(Highcharts);
    
    // Return a component that uses the initialized Highcharts
    const Component = ({ options }) => {
      const HighchartsReact = require('highcharts-react-official').default;
      return <HighchartsReact highcharts={Highcharts} options={options} />;
    };
    
    return Component;
  }),
  { 
    ssr: false,
    loading: () => <div className="text-white text-center py-20">Loading chart...</div>
  }
);

const OpeningStage = ({ progress = 0 }) => {
  const getConnections = () => {
    const connections = [
      ['Para', 'Unique Idea'],
      ['Para', 'Great Execution'],
      ['Para', 'Technical Skills'],
      ['Para', 'Compelling Story']
    ];
    return connections.slice(0, Math.max(1, Math.ceil(progress * connections.length)));
  };

  const options = {
    chart: {
      type: 'networkgraph',
      height: 400,
      backgroundColor: 'transparent'
    },
    title: {
      text: 'Building Para',
      style: { color: '#ffffff' }
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
      dataLabels: {
        enabled: true,
        style: {
          textOutline: 'none',
          color: '#ffffff'
        }
      },
      data: getConnections(),
      nodes: [
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
      ]
    }]
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