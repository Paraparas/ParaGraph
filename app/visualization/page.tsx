// /app/visualization/page.tsx
'use client';

import TimelineView from '@/components/visualization/TimelineView';

export default function Visualization() {
  return (
    <main className="flex-1 bg-slate-900">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Timeline</h1>
        <TimelineView />
      </div>
    </main>
  );
}