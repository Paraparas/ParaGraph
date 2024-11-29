import { NextResponse } from 'next/server';
import { getMeetingData } from '@/lib/utils/dataloader';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'cached') as 'llm' | 'cached';

    const data = await getMeetingData({ mode });
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}