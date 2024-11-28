// /components/visualization/TimelineView/Segment.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Segment as SegmentType } from '@/lib/types/transcript';
import { topicConfig } from '../shared/TopicConfig';

const DEFAULT_COLOR = '#94a3b8';

interface SegmentProps {
  segment: SegmentType;
  startPercent: number;
  widthPercent: number;
  formatTime: (seconds: number) => string;
  isHighlighted?: boolean;
}

const DetailView: React.FC<{
  segment: SegmentType;
  formatTime: (seconds: number) => string;
  onClose: () => void;
}> = ({ segment, formatTime, onClose }) => {
  const topicColor = topicConfig[segment.topic]?.color || DEFAULT_COLOR;
  const topicLabel = topicConfig[segment.topic]?.label || segment.topic;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-[32rem] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content Card */}
        <div className="bg-slate-900 rounded-lg border border-slate-700/50 shadow-xl">
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div 
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: topicColor + '20',
                  color: topicColor 
                }}
              >
                {topicLabel}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-300
                  transition-colors duration-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Timestamp */}
            <div className="text-sm text-slate-400">
              {formatTime(segment.start)} - {formatTime(segment.start + segment.duration)}
              <span className="ml-2 text-slate-500">({segment.duration}s)</span>
            </div>

            {/* Brief Summary */}
            <div className="text-lg font-medium text-white">
              {segment.briefSummary}
            </div>

            {/* Detailed Summary Points */}
            {segment.detailedSummary && (
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {segment.detailedSummary.map((point, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 text-slate-300"
                  >
                    <span 
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topicColor }}
                    />
                    <span>{point}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Original Content */}
            <div className="text-sm text-slate-400 italic pt-4 border-t border-slate-700/50">
              {segment.content}
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

const TimelineSegment: React.FC<SegmentProps> = ({
  segment,
  startPercent,
  widthPercent,
  formatTime,
  isHighlighted = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const topicColor = topicConfig[segment.topic]?.color || DEFAULT_COLOR;

  return (
    <>
      {/* Base segment */}
      <div 
        className="absolute top-0 bottom-0"
        style={{
          left: `${startPercent}%`,
          width: `${widthPercent}%`,
          opacity: isHighlighted ? 1 : 0.3,
          transition: 'opacity 0.2s ease-in-out'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg cursor-pointer overflow-hidden"
          style={{
            backgroundColor: topicColor + '20',
            borderLeft: `2px solid ${topicColor}`,
          }}
          whileHover={{
            backgroundColor: topicColor + '40',
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

      {/* Detail View Portal */}
      <AnimatePresence>
        {isExpanded && (
          <DetailView 
            segment={segment}
            formatTime={formatTime}
            onClose={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TimelineSegment;