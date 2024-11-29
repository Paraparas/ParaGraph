import { useState, useEffect } from 'react';
import { MeetingData } from '@/lib/types/transcript';
import { fetchMeetingData } from '@/lib/api/meetingData';

export function useMeetingData(mode: 'llm' | 'cached' = 'cached') {
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const result = await fetchMeetingData({ mode });
        
        if (result.success && result.data) {
          setMeetingData(result.data);
        } else {
          throw new Error(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading meeting data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [mode]);

  return { meetingData, isLoading, error };
}