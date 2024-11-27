'use client';

import React from 'react';
import TimelineView from '@/components/visualization/TimelineView';
import { topicConfig } from '@/components/visualization/shared/TopicConfig';

export default function VisualizationPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      {/* Background gradients similar to landing page */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-900" />
      
      <div className="relative">
        {/* Gradient canvas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 blur-3xl animate-pulse" />
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Meeting Visualization
            </h1>
            
            {/* Topic Legend */}
            <div className="flex flex-wrap gap-3">
              {Object.entries(topicConfig).map(([key, topic]) => (
                <div 
                  key={key}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                  <span className="text-sm text-slate-300">
                    {topic.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline View */}
          <div className="rounded-xl bg-slate-800/20 border border-slate-700/50 backdrop-blur-sm p-6">
            <TimelineView />
          </div>

          {/* Future: Additional visualizations or controls can go here */}
        </div>
      </div>
    </main>
  );
}