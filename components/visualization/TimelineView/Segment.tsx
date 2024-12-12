'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Segment } from '@/lib/types/transcript';
import { topicConfig } from '../shared/TopicConfig';
import { select } from 'd3-selection';

const DEFAULT_COLOR = '#94a3b8';

interface SegmentProps {
  segment: Segment;
  startPercent: number;
  widthPercent: number;
  formatTime: (seconds: number) => string;
  isHighlighted?: boolean;
}

const DetailView = ({
  segment,
  formatTime,
  onClose
}: {
  segment: Segment;
  formatTime: (seconds: number) => string;
  onClose: () => void;
}) => {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const segmentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const topicColor = topicConfig[segment.topic]?.color || DEFAULT_COLOR;

  // Create gradient effect using D3
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    
    // Clear existing gradients
    svg.selectAll('defs').remove();
    
    // Create gradient def
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', `segment-gradient-${segment.start}`)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    // Edge gradient - stronger color
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', topicColor)
      .attr('stop-opacity', 0.8);

    // Middle section - softer color
    gradient.append('stop')
      .attr('offset', '20%')
      .attr('stop-color', topicColor)
      .attr('stop-opacity', 0.2);

    gradient.append('stop')
      .attr('offset', '80%')
      .attr('stop-color', topicColor)
      .attr('stop-opacity', 0.2);

    // Fade out at the end
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', topicColor)
      .attr('stop-opacity', 0.1);

  }, [topicColor, segment.start]);

  return (
    <div
      ref={segmentRef}
      className="absolute top-0 bottom-0 group cursor-pointer"
      style={{
        left: `${startPercent}%`,
        width: `${Math.max(widthPercent, 0.2)}%`,
        opacity: isHighlighted ? 1 : 0.3
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(true)}
    >
      {/* Enhanced segment visualization */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <g>
          {/* Main segment with gradient */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#segment-gradient-${segment.start})`}
            rx="1"
          />
          {/* Left edge highlight */}
          <rect
            x="0"
            y="0"
            width="2"
            height="100%"
            fill={topicColor}
            opacity={0.9}
          />
        </g>
      </svg>

      {/* Keep tooltip and DetailView the same */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute z-50 left-0 right-0 bottom-full mb-1"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg py-2 px-3 mx-auto inline-block whitespace-nowrap">
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <div 
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: topicColor }}
                />
                <span>{formatTime(segment.start)} - {formatTime(segment.start + segment.duration)}</span>
              </div>
              <div className="text-sm text-white font-medium">
                {segment.briefSummary}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <DetailView
            segment={segment}
            formatTime={formatTime}
            onClose={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimelineSegment;