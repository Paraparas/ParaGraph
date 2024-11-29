import { MeetingData } from '@/lib/types/transcript';

export async function fetchMeetingData(options: {
  mode: 'llm' | 'cached'
}): Promise<{
  success: boolean;
  data?: MeetingData;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/meeting-data?mode=${options.mode}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch meeting data');
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch meeting data'
    };
  }
}