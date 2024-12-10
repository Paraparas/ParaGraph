import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const transcriptPath = join(process.cwd(), 'data/raw/test-transcript.md');
    const transcript = await readFile(transcriptPath, 'utf-8');
    
    return NextResponse.json({
      success: true,
      transcript
    });
  } catch (error) {
    console.error('Error loading transcript:', error);
    return NextResponse.json(
      { error: 'Failed to load transcript' },
      { status: 500 }
    );
  }
}