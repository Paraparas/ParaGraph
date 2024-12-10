'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimelineView from '@/components/visualization/TimelineView';
import TopicView from '@/components/visualization/TopicView';

export default function Visualization() {
  return (
    <main className="flex-1 bg-slate-900">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Meeting Visualization</h1>
        
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            <TabsTrigger value="topic">Topic Map</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineView />
          </TabsContent>

          <TabsContent value="topic">
            <TopicView />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}