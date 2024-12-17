'use client';

import React from 'react';
import MeetingOverview from './MeetingOverview';
import DataCard from './DataCard';
import { useMeetingData } from '@/lib/hooks/useMeetingData';


// Mock data
const topicData = [
  { name: 'Vision', value: 8, color: '#8b5cf6' },
  { name: 'Technology', value: 7, color: '#10b981' },
  { name: 'UX', value: 6, color: '#ec4899' },
  { name: 'Planning', value: 5, color: '#f59e0b' },
  { name: 'Other', value: 3, color: '#94a3b8' }
];

const QuickView: React.FC = () => {
  const { meetingData, isLoading, error } = useMeetingData('cached');

  return (
    <div className="space-y-6">
      {/* Meeting Overview with Topic Distribution */}
      <MeetingOverview
        duration="24m 22s"
        participants={4}
        topics={5}
        segments={34}
        topicData={topicData}
      />

      {/* Key Insights */}
      <DataCard title="Key Insights">
        <div className="space-y-3">
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>ParaGraph takes an active approach to knowledge sharing, moving beyond passive storage to enable dynamic connection discovery and pattern recognition.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>The system employs a multi-stage processing pipeline that combines real-time analysis with deeper, context-aware processing to identify meaningful connections.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>Privacy and security are prioritized through self-hosted infrastructure options and granular control over connection sharing.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>The visualization system balances sophisticated analysis capabilities with intuitive user experience, using color coding and interactive layers.</div>
          </div>
        </div>
      </DataCard>

      {/* Action Items */}
      <DataCard title="Action Items">
        <div className="space-y-3">
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>Muhammad will explore the visualization system thoroughly before starting development work on the processing pipeline.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>Kinan will conduct an architecture walkthrough with Muhammad tomorrow, focusing on the connection detection system.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>Ewa will continue refining the visualization components, with emphasis on making complex networks more intuitive.</div>
          </div>
          <div className="flex gap-3 text-slate-300">
            <span className="text-slate-400">•</span>
            <div>Qi will gather more specific requirements from academic and corporate partners to guide feature prioritization.</div>
          </div>
        </div>
      </DataCard>
    </div>
  );
};

export default QuickView;