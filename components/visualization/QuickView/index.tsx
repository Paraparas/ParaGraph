'use client';

import React from 'react';
import MeetingOverview from './MeetingOverview';
import DataCard from './DataCard';
import { useMeetingData } from '@/lib/hooks/useMeetingData';

// Mock data for topic distribution (can be ignored for now)
const topicData = [
  { name: 'Vision', value: 8, color: '#8b5cf6' },
  { name: 'Technology', value: 7, color: '#10b981' },
  { name: 'UX', value: 6, color: '#ec4899' },
  { name: 'Planning', value: 5, color: '#f59e0b' },
  { name: 'Other', value: 3, color: '#94a3b8' }
];

const QuickView: React.FC = () => {
  const { meetingData, isLoading, error } = useMeetingData('cached');

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  }
  
  // Extract data for MeetingOverview
  const participants = meetingData?.speakers.length || 0;
  const segments = meetingData?.segments.length || 0;
  const duration = meetingData
    ? formatDuration(
        Math.max(...meetingData.segments.map(seg => seg.start + seg.duration), 0)
      )
    : '0s';
  const topics = meetingData
    ? new Set(meetingData.segments.map(seg => seg.topic)).size
    : 0;

  // Extract key insights and action items
  const keyInsights = meetingData?.key_insights || [];
  const actionItems = meetingData?.action_items || [];

  return (
    <div className="space-y-6">
      {/* Meeting Overview with Topic Distribution */}
      <MeetingOverview
        duration={duration}
        participants={participants}
        topics={topics}
        segments={segments}
        topicData={topicData}
      />

      {/* Key Insights */}
      <DataCard title="Key Insights">
        <div className="space-y-3">
          {keyInsights.length > 0 ? (
            keyInsights.map((insight, index) => (
              <div key={index} className="flex gap-3 text-slate-300">
                <span className="text-slate-400">•</span>
                <div>{insight}</div>
              </div>
            ))
          ) : (
            <div className="text-slate-400">No key insights available.</div>
          )}
        </div>
      </DataCard>

      {/* Action Items */}
      <DataCard title="Action Items">
        <div className="space-y-3">
          {actionItems.length > 0 ? (
            actionItems.map((item, index) => (
              <div key={index} className="flex gap-3 text-slate-300">
                <span className="text-slate-400">•</span>
                <div>
                  <strong>{item.person}</strong> -{' '}
                  {item.tasks.join(', ')}
                </div>
              </div>
            ))
          ) : (
            <div className="text-slate-400">No action items available.</div>
          )}
        </div>
      </DataCard>
    </div>
  );
};

export default QuickView;
