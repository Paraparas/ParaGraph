'use client';

import React, { useState } from 'react';
import { Users, Briefcase, LineChart } from 'lucide-react'; // Add LineChart icon
import TimelineView from '@/components/visualization/TimelineView';
import TopicView from '@/components/visualization/TopicView';
import QuickView from '@/components/visualization/QuickView';

const MeetingVisualizer = () => {
  const [activeView, setActiveView] = useState('quick'); // Default to QuickView

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">
        ParaGraph
      </h1>

      <div className="space-y-6">
        {/* View Selector */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveView('quick')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
              ${activeView === 'quick' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-slate-300'}`}
          >
            <LineChart size={18} />
            <span className="font-medium">Quick View</span>
          </button>
          <button
            onClick={() => setActiveView('member')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
              ${activeView === 'member' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-slate-300'}`}
          >
            <Users size={18} />
            <span className="font-medium">Member View</span>
          </button>
          <button
            onClick={() => setActiveView('project')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors
              ${activeView === 'project' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-slate-300'}`}
          >
            <Briefcase size={18} />
            <span className="font-medium">Project View</span>
          </button>
        </div>

        {/* View Description */}
        <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
          <div className="p-2 bg-slate-700 rounded-md">
            {activeView === 'quick' ? (
              <LineChart size={24} className="text-blue-400" />
            ) : activeView === 'member' ? (
              <Users size={24} className="text-purple-400" />
            ) : (
              <Briefcase size={24} className="text-blue-400" />
            )}
          </div>
          <div className="space-y-1">
            <h2 className="font-medium text-white">
              {activeView === 'quick' 
                ? 'Quick View' 
                : activeView === 'member' 
                ? 'Member View' 
                : 'Project View'}
            </h2>
            <p className="text-sm text-slate-400">
              {activeView === 'quick'
                ? 'Get a quick overview of the meeting with key metrics, insights, and action items.'
                : activeView === 'member' 
                ? 'View individual contributions and personal growth through meeting participation and topic engagement.'
                : 'Explore team knowledge evolution and connections between ideas across the project timeline.'}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[600px] rounded-lg border border-slate-700/50 overflow-hidden">
          <div className="h-full bg-slate-800/30 p-6">
            {activeView === 'quick' ? (
              <QuickView />
            ) : activeView === 'member' ? (
              <TimelineView />
            ) : (
              <TopicView />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingVisualizer;