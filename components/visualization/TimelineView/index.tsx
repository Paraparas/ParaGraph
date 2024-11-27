'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import TimelineSegment from './Segment';
import { MeetingData, Speaker, Segment } from '@/lib/types/transcript';

// Format time helper
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Sample meeting data with proper typing
const meetingData: MeetingData = {
  speakers: [
    { id: 'M', name: 'Muhammad' },
    { id: 'K', name: 'Kinan' },
    { id: 'E', name: 'Ewa' },
    { id: 'Q', name: 'Qi' }
  ],
  segments: {
    'M': [
      {
        topic: 'ASR',
        start: 0,
        duration: 12,
        content: "Thanks for having this onboarding meeting...",
        briefSummary: "Onboarding Meeting",
        detailedSummary: [
          "Initial introduction",
          "Looking to understand project scope",
          "Seeking team structure info"
        ]
      }
    ],
    'Q': [
      {
        topic: 'VIZ',
        start: 12,
        duration: 19,
        content: "Great question, Muhammad. ParaGraph transforms meeting discussions...",
        briefSummary: "ParaGraph Overview",
        detailedSummary: [
          "Meeting visualization concept",
          "Transform discussions into visuals",
          "Interactive knowledge mapping"
        ]
      }
    ],
    'K': [
      {
        topic: 'ASR',
        start: 31,
        duration: 27,
        content: "Sure. We're using real-time speech processing with two key innovations...",
        briefSummary: "ASR Technology",
        detailedSummary: [
          "Real-time speech processing",
          "Speaker diarization feature",
          "Two key innovations discussed"
        ]
      }
    ],
    'E': [
      {
        topic: 'VIZ',
        start: 58,
        duration: 26,
        content: "Exactly, Kinan. The temporal flow view is our first layer of visualization...",
        briefSummary: "Visualization Layers",
        detailedSummary: [
          "Temporal flow visualization",
          "First layer implementation",
          "User interaction design"
        ]
      }
    ]
  }
};

interface TimelineViewProps {
  data?: MeetingData;
}

const TimelineView: React.FC<TimelineViewProps> = ({ data = meetingData }) => {
  const [collapsedSpeakers, setCollapsedSpeakers] = useState<Record<string, boolean>>({});
  const totalDuration = 300; // 5 minutes in seconds

  const getSegmentsForSpeaker = (speaker: Speaker): Segment[] => {
    return data.segments[speaker.id] || [];
  };

  return (
    <div className="space-y-2">
      {/* Timeline ruler */}
      <div className="h-8 relative border-b border-slate-700/50 mb-4">
        <div className="absolute inset-x-0 flex justify-between px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="text-slate-400 text-sm">
              {formatTime(i * 60)}
            </div>
          ))}
        </div>
      </div>

      {/* Speaker lanes */}
      {data.speakers.map(speaker => (
        <Card 
          key={speaker.id}
          className="bg-slate-800/50 border-slate-700/50 backdrop-blur transition-all duration-300
            hover:bg-slate-800/70 hover:border-slate-600/50"
        >
          <CardContent className="p-0">
            {/* Speaker header */}
            <div className="flex items-center px-4 h-12 border-b border-slate-700/50">
              <button
                onClick={() => setCollapsedSpeakers(prev => ({
                  ...prev,
                  [speaker.id]: !prev[speaker.id]
                }))}
                className="h-8 w-8 flex items-center justify-center rounded-lg
                  hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 transition-colors"
              >
                <span className="sr-only">Toggle speaker lane</span>
                {collapsedSpeakers[speaker.id] ? "→" : "↓"}
              </button>
              <span className="ml-2 text-slate-200 font-medium">{speaker.name}</span>
            </div>

            {/* Timeline segments */}
            <AnimatePresence>
              {!collapsedSpeakers[speaker.id] && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="p-4"
                >
                  <div className="relative h-16">
                    {getSegmentsForSpeaker(speaker).map((segment, idx) => {
                      const startPercent = (segment.start / totalDuration) * 100;
                      const widthPercent = (segment.duration / totalDuration) * 100;
                      
                      return (
                        <TimelineSegment
                          key={idx}
                          segment={segment}
                          startPercent={startPercent}
                          widthPercent={widthPercent}
                          formatTime={formatTime}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TimelineView;