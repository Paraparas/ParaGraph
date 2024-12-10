'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MeetingData } from '@/lib/types/transcript';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestMapper() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  // Load the meeting data using meeting-data API
  useEffect(() => {
    async function loadMeetingData() {
      try {
        const response = await fetch('/api/meeting-data?mode=cached');
        const { success, data, error } = await response.json();
        if (!success) {
          console.error('Failed to load meeting data:', error);
          return;
        }
        setMeetingData(data);
      } catch (error) {
        console.error('Error loading meeting data:', error);
      }
    }
    loadMeetingData();
  }, []);

  async function testMapperAgent() {
    if (!meetingData) {
      setResult({ error: 'No meeting data loaded' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/mapper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingData })
      });
      const data = await response.json();
      if (!data.success) {
        setResult({
          error: 'Failed to process meeting data',
          details: data.error
        });
        return;
      }
      setResult(data);
    } catch (error) {
      console.error('Error testing mapper:', error);
      setResult({
        error: 'Failed to test mapper',
        details: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  }

  // Render the trace visualization
  const renderTrace = (trace: any) => {
    if (!trace) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Agent State:</h3>
        <Card className="p-4">
          <div className="font-medium">Current Stage: {trace.stage}</div>
          
          <div className="mt-4">
            <div className="text-sm text-gray-600">Nodes:</div>
            <div className="mt-2">
              <h4 className="font-medium">Main Topics:</h4>
              <pre className="mt-1 bg-slate-900 p-4 rounded-lg overflow-auto">
                {JSON.stringify(trace.nodes.mainTopics, null, 2)}
              </pre>
              
              <h4 className="font-medium mt-4">Subtopics:</h4>
              <pre className="mt-1 bg-slate-900 p-4 rounded-lg overflow-auto">
                {JSON.stringify(trace.nodes.subtopics, null, 2)}
              </pre>
            </div>
          </div>
  
          <div className="mt-4">
            <div className="text-sm text-gray-600">Debug Information:</div>
            {trace.debug.reasoning && (
              <div className="mt-2">
                <h4 className="font-medium">Reasoning:</h4>
                <div className="mt-1 whitespace-pre-wrap text-sm">
                  <p className="font-medium">Raw:</p>
                  <p className="ml-2">{trace.debug.reasoning.raw}</p>
                  <p className="font-medium mt-2">Processed:</p>
                  <p className="ml-2">{trace.debug.reasoning.processed}</p>
                </div>
              </div>
            )}
            {Object.keys(trace.debug.topicConfidence).length > 0 && (
              <div className="mt-2">
                <h4 className="font-medium">Topic Confidence:</h4>
                <pre className="mt-1 bg-slate-900 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(trace.debug.topicConfidence, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test MapperAgent</h1>
      <div className="mb-4">
        <Button
          onClick={testMapperAgent}
          disabled={loading || !meetingData}
        >
          {loading ? 'Processing...' : 'Test MapperAgent'}
        </Button>
        {!meetingData && (
          <p className="text-yellow-500 mt-2">Loading meeting data...</p>
        )}
      </div>

      {result && (
        <Tabs defaultValue="results" className="mt-4">
          <TabsList>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="trace">Agent Trace</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4">Extracted Topics</h2>
              {result.nodes && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Main Topics:</h3>
                    <pre className="mt-2 bg-slate-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(result.nodes.filter((n: any) => n.type === 'main'), null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h3 className="font-medium">Subtopics:</h3>
                    <pre className="mt-2 bg-slate-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(result.nodes.filter((n: any) => n.type === 'subtopic'), null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="trace">
            <Card className="p-4">
              {result.trace && renderTrace(result.trace)}
            </Card>
          </TabsContent>

          <TabsContent value="raw">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-2">Raw Response Data</h2>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {result?.error && (
        <Card className="mt-4 p-4">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error:</h2>
          <div className="text-red-500 mb-2">
            <p>{result.error}</p>
            {result.details && (
              <p className="text-sm mt-1">Details: {result.details}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}