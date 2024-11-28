// /components/visualization/TimelineView/index.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import TimelineSegment from './Segment';
import { MeetingData, Speaker, Segment } from '@/lib/types/transcript';
import { topicConfig } from '../shared/TopicConfig';
import { sampleMeetingData } from '@/data/samples/sample-meeting';

// Format time helper
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface TimelineViewProps {
  data?: MeetingData;
}

const TimelineView: React.FC<TimelineViewProps> = ({ data = sampleMeetingData }) => {
  const [collapsedSpeakers, setCollapsedSpeakers] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Calculate total duration from the last segment
  const totalDuration = useMemo(() => {
    return Math.max(
      ...Object.values(data.segments).flatMap(segments =>
        segments.map(seg => seg.start + seg.duration)
      ),
      300 // Minimum 5 minutes
    );
  }, [data]);

  // Generate time markers for the ruler
  const timeMarkers = useMemo(() => {
    const markerCount = Math.ceil(totalDuration / 60);
    return Array.from({ length: markerCount + 1 }, (_, i) => i * 60);
  }, [totalDuration]);

  const getSegmentsForSpeaker = (speaker: Speaker): Segment[] => {
    return data.segments[speaker.id] || [];
  };

  // Calculate speaker statistics
  const speakerStats = useMemo(() => {
    return data.speakers.map(speaker => {
      const segments = getSegmentsForSpeaker(speaker);
      const totalTime = segments.reduce((sum, seg) => sum + seg.duration, 0);
      const topicCounts = segments.reduce((counts, seg) => ({
        ...counts,
        [seg.topic]: (counts[seg.topic] || 0) + 1
      }), {} as Record<string, number>);

      return {
        ...speaker,
        totalTime,
        segmentCount: segments.length,
        topicCounts
      };
    });
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Topic Filter Bar */}
      <div className="sticky top-0 z-40 bg-slate-900 -mx-6 px-6 py-3 border-b border-slate-700/50">
        <div className="flex flex-wrap gap-2">
          {Object.entries(topicConfig).map(([key, { color, label }]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(selectedTopic === key ? null : key)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all
                ${selectedTopic && selectedTopic !== key ? 'opacity-50' : 'opacity-100'}
                hover:opacity-100 hover:scale-105`}
              style={{ 
                backgroundColor: `${color}20`,
                borderColor: color,
                borderWidth: '1px',
                color: color
              }}
            >
              <span className="flex items-center gap-2">
                {label}
                {selectedTopic === key && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-800">
                    {Object.values(data.segments)
                      .flat()
                      .filter(seg => seg.topic === key)
                      .length}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="space-y-6">
        {/* Timeline ruler */}
        <div className="h-8 relative border-b border-slate-700/50">
          <div className="absolute inset-x-0 flex justify-between px-4">
            {timeMarkers.map((time, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-px h-2 bg-slate-700/50"/>
                <div className="text-slate-400 text-sm">
                  {formatTime(time)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speaker lanes */}
        <div className="space-y-2">
          {speakerStats.map(speaker => {
            const segments = getSegmentsForSpeaker(speaker);
            const hasSelectedTopicSegments = !selectedTopic || 
              segments.some(seg => seg.topic === selectedTopic);

            return (
              <Card 
                key={speaker.id}
                className={`bg-slate-800 border-slate-700/50 backdrop-blur transition-all duration-300
                  hover:border-slate-600/50
                  ${!hasSelectedTopicSegments ? 'opacity-50' : 'opacity-100'}`}
              >
                <CardContent className="p-0">
                  {/* Speaker header */}
                  <div className="flex items-center justify-between px-4 h-12 border-b border-slate-700/50">
                    <div className="flex items-center">
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
                      <span className="ml-2 text-slate-200 font-medium">
                        {speaker.name}
                      </span>
                      <div className="ml-3 flex gap-2 text-xs text-slate-400">
                        <span>{formatTime(speaker.totalTime)} total</span>
                        <span>•</span>
                        <span>{speaker.segmentCount} segments</span>
                      </div>
                    </div>

                    {/* Topic indicators */}
                    <div className="flex gap-1">
                      {Object.entries(speaker.topicCounts)
                        .sort(([,a], [,b]) => b - a)
                        .map(([topic, count]) => (
                          <div
                            key={topic}
                            className="px-2 py-0.5 text-xs rounded-full"
                            style={{ 
                              backgroundColor: `${topicConfig[topic].color}20`,
                              color: topicConfig[topic].color
                            }}
                          >
                            {count}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Timeline segments */}
                  <AnimatePresence>
                    {!collapsedSpeakers[speaker.id] && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="p-4"
                      >
                        <div className="relative h-16">
                          {segments.map((segment, idx) => {
                            const startPercent = (segment.start / totalDuration) * 100;
                            const widthPercent = (segment.duration / totalDuration) * 100;
                            const isHighlighted = !selectedTopic || segment.topic === selectedTopic;
                            
                            return (
                              <TimelineSegment
                                key={idx}
                                segment={segment}
                                startPercent={startPercent}
                                widthPercent={widthPercent}
                                formatTime={formatTime}
                                isHighlighted={isHighlighted}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;