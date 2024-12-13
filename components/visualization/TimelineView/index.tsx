'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TimelineSegment from './Segment';
import {
  MeetingData,
  Speaker,
  Segment
} from '@/lib/types/transcript';
import { topicConfig } from '../shared/TopicConfig';
console.log("Loaded topicConfig:", topicConfig);
import { useMeetingData } from '@/lib/hooks/useMeetingData';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

interface TimelineViewProps {
  data?: MeetingData;
}

const TimelineView: React.FC = () => {
  // 1. Data loading hook
  const { meetingData, isLoading, error } = useMeetingData('cached');

  // 2. All useState hooks
  const [collapsedSpeakers, setCollapsedSpeakers] = useState<Record<string, boolean>>({});
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Add new state for container width
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        // Get actual container width minus padding
        const width = containerRef.current.getBoundingClientRect().width - 32; // 2rem (px-4)
        setContainerWidth(width);
      }
    };
    
    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);

  // 4. useMemo hooks
  // Process speaker statistics from the new schema
  const speakerStats = useMemo(() => {
    if (!meetingData) return [];

    // Group segments by speaker_id
    const segmentsBySpeaker = meetingData.segments.reduce<Record<string, typeof meetingData.segments>>(
      (acc, segment) => {
        if (!acc[segment.speaker_id]) {
          acc[segment.speaker_id] = [];
        }
        acc[segment.speaker_id].push(segment);
        return acc;
      },
      {}
    );

    // Calculate stats for each speaker
    return meetingData.speakers.map(speaker => {
      const segments = segmentsBySpeaker[speaker.id] || [];
      const totalTime = segments.reduce((sum, seg) => sum + seg.duration, 0);
      const topicCounts = segments.reduce(
        (counts, seg) => ({
          ...counts,
          [seg.topic]: (counts[seg.topic] || 0) + 1
        }),
        {} as Record<string, number>
      );

      return {
        ...speaker,
        totalTime,
        segmentCount: segments.length,
        topicCounts
      };
    });
  }, [meetingData]);

  // Calculate the total duration of all segments
  const totalDuration = useMemo(() => {
    if (!meetingData || !meetingData.segments.length) return 300;
    return Math.max(
      ...meetingData.segments.map(seg => seg.start + seg.duration),
      300
    );
  }, [meetingData]);

  // Generate time markers based on the total duration
  const timeMarkers = useMemo(() => {
    if (!containerWidth || !totalDuration) return [];

    // Aim for a marker every ~120px
    const desiredMarkerCount = Math.floor(containerWidth / 120);
    const interval = Math.ceil(totalDuration / desiredMarkerCount);
    const roundedInterval = Math.ceil(interval / 30) * 30;

    return Array.from(
      { length: Math.ceil(totalDuration / roundedInterval) + 1 },
      (_, i) => i * roundedInterval
    );
  }, [containerWidth, totalDuration]);

  // Add debug log for timeMarkers
  useEffect(() => {
    console.log('timeMarkers:', timeMarkers);
    console.log('containerWidth:', containerWidth);
    console.log('totalDuration:', totalDuration);
  }, [timeMarkers, containerWidth, totalDuration]);

  // 7. Loading and error states
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-slate-400">Loading meeting data...</div>
    </div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-red-400">Error: {error}</div>
    </div>;
  }

  if (!meetingData) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-slate-400">No meeting data available</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Topic Filter Bar - clean version */}
      <div className="sticky top-0 z-40 bg-slate-900 border-b border-slate-700/50">
        <div className="flex flex-wrap gap-2 py-3">
          {Object.entries(topicConfig).map(([key, { color, label }]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(selectedTopic === key ? null : key)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors
                ${selectedTopic && selectedTopic !== key ? 'opacity-50' : 'opacity-100'}
                hover:opacity-100`}
              style={{
                backgroundColor: `${color}15`,
                borderColor: color,
                borderWidth: '1px',
                color: color
              }}
            >
              <span className="flex items-center gap-2">
                {label}
                {selectedTopic === key && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-800">
                    {Object.values(meetingData.segments)
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

            {/* Timeline Content - clean version */}
            <div className="relative w-full" ref={containerRef}>
        {/* Time Ruler */}
        <div className="h-8 relative border-b border-slate-700/50 overflow-visible">
          <div className="absolute inset-x-0 flex justify-between px-4">
            {timeMarkers.map((time, i) => (
              <div key={i} className="flex flex-col items-center relative">
                <div className="w-px h-3 bg-slate-700/50 absolute bottom-0" />
                <div className="text-slate-400 text-xs absolute -bottom-6">
                  {formatTime(time)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Speaker Lanes */}
        <div className="space-y-2">
          {speakerStats.map(speaker => {
            // Filter segments for the current speaker
            const segments = meetingData.segments.filter(
              segment => segment.speaker_id === speaker.id
            );
            return (
              <Card key={speaker.id} className="border-slate-700/50 bg-slate-800">
                <CardContent className="p-0">
                  {/* Speaker Header */}
                  <div className="flex items-center justify-between px-4 h-12 border-b border-slate-700/50">
                    <div className="flex items-center">
                      <button
                        onClick={() => setCollapsedSpeakers(prev => ({
                          ...prev,
                          [speaker.id]: !prev[speaker.id]
                        }))}
                        className="h-8 w-8 flex items-center justify-center rounded-lg
                              hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 
                              transition-colors"
                      >
                        {collapsedSpeakers[speaker.id] ?
                          <ChevronRight className="w-4 h-4" /> :
                          <ChevronLeft className="w-4 h-4 rotate-90" />
                        }
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

                    {/* Topic Indicators - simplified */}
                    <div className="flex gap-1">
                      {Object.entries(speaker.topicCounts)
                        .sort(([, a], [, b]) => b - a)
                        .map(([topic, count]) => (
                          <div
                            key={topic}
                            className="px-2 py-0.5 text-xs rounded-full"
                            // style={{
                            //   backgroundColor: `${topicConfig[topic].color}15`,
                            //   color: topicConfig[topic].color
                            // }}
                          >
                            {count}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Timeline Segments */}
                  <AnimatePresence>
                    {!collapsedSpeakers[speaker.id] && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                      >
                        <div className="relative h-16">
                          {segments.map((segment, idx) => (
                            <TimelineSegment
                              key={idx}
                              segment={segment}
                              startPercent={(segment.start / totalDuration) * 100}
                              widthPercent={Math.max((segment.duration / totalDuration) * 100, 0.2)} // Minimum width 0.2%
                              formatTime={formatTime}
                              isHighlighted={!selectedTopic || segment.topic === selectedTopic}
                            />
                          ))}
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