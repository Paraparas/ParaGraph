'use client';

import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { pie, arc } from 'd3-shape';
import { transition } from 'd3-transition';
import 'd3-transition';

interface TopicData {
  name: string;
  value: number;
  color: string;
}

interface MeetingOverviewProps {
  duration: string;
  participants: number;
  topics: number;
  segments: number;
  topicData: TopicData[];
}

const MeetingOverview: React.FC<MeetingOverviewProps> = ({
  duration,
  participants,
  topics,
  segments,
  topicData,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear existing content
    select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create pie layout
    const pieLayout = pie<TopicData>()
      .value(d => d.value)
      .sort(null);

    // Create arc generator
    const arcGenerator = arc<any>()
      .innerRadius(0)
      .outerRadius(radius);

    // Add slices
    const slices = svg
      .selectAll('path')
      .data(pieLayout(topicData))
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 2)
      .style('opacity', 0.9) // Start slightly transparent
      .on('mouseenter', function(event) {
        select(this)
          .style('opacity', 1)
          .style('transform', 'scale(1.02)')
          .style('filter', 'brightness(1.1)');
      })
      .on('mouseleave', function(event) {
        select(this)
          .style('opacity', 0.9)
          .style('transform', 'scale(1)')
          .style('filter', 'brightness(1)');
      });
  }, [topicData]);

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-6">Meeting Overview</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Stats */}
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Duration</span>
              <span className="text-white font-medium">{duration}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Participants</span>
              <span className="text-white font-medium">{participants}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Topics</span>
              <span className="text-white font-medium">{topics}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Segments</span>
              <span className="text-white font-medium">{segments}</span>
            </div>
          </div>

          {/* Topic Legend */}
          <div className="space-y-2 mt-4">
            {topicData.map((topic) => (
              <div key={topic.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: topic.color }}
                />
                <span className="text-slate-400 flex-grow">{topic.name}</span>
                <span className="text-white font-medium">{topic.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <svg ref={svgRef} />
        </div>
      </div>
    </div>
  );
};

export default MeetingOverview;