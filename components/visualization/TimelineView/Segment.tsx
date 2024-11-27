'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Segment as SegmentType } from '@/lib/types/transcript';
import { topicConfig } from '@/components/visualization/shared/TopicConfig';

interface SegmentProps {
  segment: SegmentType;
  startPercent: number;
  widthPercent: number;
  formatTime: (seconds: number) => string;
}

const TimelineSegment: React.FC<SegmentProps> = ({
  segment,
  startPercent,
  widthPercent,
  formatTime
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Base segment */}
      <div 
        className="absolute top-0 bottom-0"
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
          zIndex: isExpanded ? 50 : 1
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg cursor-pointer"
          style={{
            backgroundColor: topicConfig[segment.topic].color + '20',
            borderLeft: `2px solid ${topicConfig[segment.topic].color}`,
          }}
          whileHover={{
            backgroundColor: topicConfig[segment.topic].color + '40',
            y: -2,
            transition: { duration: 0.2 }
          }}
          onClick={() => setIsExpanded(true)}
        >
          <div className="p-2">
            <div className="text-xs text-slate-300 line-clamp-2">
              {segment.briefSummary || segment.content.slice(0, 30) + '...'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popup Portal for Detail View */}
      {isExpanded && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }} onClick={() => setIsExpanded(false)}>
          <div 
            className="absolute"
            style={{
              left: `calc(${startPercent}% + 8px)`,
              top: `calc(${document.querySelector('.relative.h-16')?.getBoundingClientRect().top}px - 12px)`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-80 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blur background */}
              <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-lg border border-slate-700/50">
                <div className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: topicConfig[segment.topic].color + '20',
                        color: topicConfig[segment.topic].color 
                      }}
                    >
                      {topicConfig[segment.topic].label}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                      }}
                      className="p-1 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-300"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Time */}
                  <div className="text-xs text-slate-400">
                    {formatTime(segment.start)} - {formatTime(segment.start + segment.duration)}
                  </div>

                  {/* Summary */}
                  <div className="font-medium text-white">
                    {segment.briefSummary}
                  </div>

                  {/* Details */}
                  {segment.detailedSummary && (
                    <div className="space-y-2">
                      {segment.detailedSummary.map((point, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <span className="text-slate-500">•</span>
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Original text */}
                  <div className="text-xs text-slate-400 italic pt-2 border-t border-slate-700/50">
                    {segment.content}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div 
                className="absolute top-full left-4 w-3 h-3 -mt-1.5 rotate-45 bg-slate-900 border-r border-b border-slate-700/50"
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimelineSegment;