import { getMeetingData } from '@/lib/utils/dataloader';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get 'mode' from query parameters
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') as 'llm' | 'cached' || 'cached';

    const result = await getMeetingData({ mode });
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Test failed:', errorMessage);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}