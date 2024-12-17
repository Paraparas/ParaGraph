import { QuickViewData } from '@/lib/types/quickView';

export async function fetchQuickViewData(options: {
  mode: 'llm' | 'cached'
}): Promise<{
  success: boolean;
  data?: QuickViewData;
  error?: string;
}> {
  try {
    const response = await fetch(`/api/quickview-data?mode=${options.mode}`);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch quick view data');
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quick view data'
    };
  }
}