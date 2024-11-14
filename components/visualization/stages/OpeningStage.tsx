'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HighchartsWrapper = dynamic(() => 
  import('highcharts/highstock').then(async (mod) => {
    const Highcharts = mod.default;
    const networkgraph = await import('highcharts/modules/networkgraph');
    networkgraph.default(Highcharts);
    return ({ options }) => {
      const HighchartsReact = require('highcharts-react-official').default;
      return <HighchartsReact highcharts={Highcharts} options={options} />;
    };
  }),
  { ssr: false }
);

const OpeningStage = ({ progress = 0 }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize nodes with fixed positions
  const nodePositions = {
    'Para': { x: 200, y: 200 },           // Center
    'Unique Idea': { x: 100, y: 100 },    // Top left
    'Great Execution': { x: 300, y: 100 }, // Top right
    'Technical Skills': { x: 100, y: 300 }, // Bottom left
    'Compelling Story': { x: 300, y: 300 }  // Bottom right
  };

  useEffect(() => {
    console.log('OpeningStage mounted with progress:', progress);
    setIsLoading(false);
  }, []);

  // Calculate connections based on progress
  const getConnections = () => {
    // Define all possible connections
    const connections = [
      ['Para', 'Unique Idea'],
      ['Para', 'Great Execution'],
      ['Para', 'Technical Skills'],
      ['Para', 'Compelling Story']
    ];

    // Number of visible connections based on progress
    const visibleCount = Math.ceil(progress * connections.length);
    console.log('Visible connections:', visibleCount);
    
    return connections.slice(0, visibleCount);
  };

  const options = {
    accessibility: { enabled: false },
    chart: {
      type: 'networkgraph',
      height: '400px',
      backgroundColor: 'transparent',
      animation: {
        duration: 1000
      },
      events: {
        load: function() {
          console.log('Chart loaded with nodes:', this.series[0].nodes);
        }
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: 'Building Para',
      style: {
        color: '#ffffff'
      }
    },
    plotOptions: {
      networkgraph: {
        layoutAlgorithm: {
          enableSimulation: false,
          gravitationalConstant: 0.5,
          initialPositions: 'fixed',
          initialPositionRadius: 0
        },
        keys: ['from', 'to'],
        marker: {
          radius: 30,
          lineWidth: 2,
          lineColor: '#2563eb'
        }
      }
    },
    series: [{
      dataLabels: {
        enabled: true,
        linkFormat: '',
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#ffffff'
        }
      },
      // data: getConnections(),
      data: [
        { from: 'Para', to: 'Unique Idea' },
        { from: 'Para', to: 'Great Execution' },
        { from: 'Para', to: 'Technical Skills' },
        { from: 'Para', to: 'Compelling Story' }
      ],
      nodes: [
        {
          id: 'Para',
          marker: {
            radius: 40,
            fillColor: '#2563eb'
          },
          fixed: false,
          ...nodePositions['Para']
        },
        {
          id: 'Unique Idea',
          marker: {
            radius: 35,
            fillColor: '#3b82f6'
          },
          fixed: false,
          ...nodePositions['Unique Idea']
        },
        {
          id: 'Great Execution',
          marker: {
            radius: 35,
            fillColor: '#3b82f6'
          },
          fixed: false,
          ...nodePositions['Great Execution']
        },
        {
          id: 'Technical Skills',
          marker: {
            radius: 35,
            fillColor: '#3b82f6'
          },
          fixed: false,
          ...nodePositions['Technical Skills']
        },
        {
          id: 'Compelling Story',
          marker: {
            radius: 35,
            fillColor: '#3b82f6'
          },
          fixed: false,
          ...nodePositions['Compelling Story']
        }
      ],
      states: {
        inactive: {
          linkOpacity: 1
        }
      }
    }]
  };

  console.log('Current progress:', progress);
  console.log('Visible connections:', getConnections());

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-blue-900 rounded-lg p-6">
      {isLoading ? (
        <div className="text-white text-center py-20">Loading visualization...</div>
      ) : (
        <div className="w-full h-[400px]">
          <HighchartsWrapper options={options} />
        </div>
      )}
    </div>
  );
};

export default OpeningStage;