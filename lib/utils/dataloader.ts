import { readFile } from 'fs/promises';
import path from 'path';
import { MeetingData } from '../types/transcript';
import { TranscriptProcessor } from './llmProcessor';

export async function getMeetingData(options: {
  mode: 'llm' | 'cached';
  transcriptPath?: string;
  cachePath?: string;
}): Promise<MeetingData> {
  const {
    mode = 'cached',
    transcriptPath = 'data/raw/raw-test.txt',
    cachePath = 'data/processed/test-meeting-1.json'
  } = options;

  try {
    if (mode === 'llm') {
      // Here we're using readFile
      const rawTranscript = await readFile(
        path.join(process.cwd(), transcriptPath),
        'utf-8'
      );
      const processor = new TranscriptProcessor();
      const refinedTranscript = await processor.refineRawTranscript(rawTranscript);
      const result = await processor.processRefinedTranscript(refinedTranscript);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.data;
    } else {
      // Here we're also using readFile for cached data
      const cachedData = await readFile(
        path.join(process.cwd(), cachePath),
        'utf-8'
      );
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('Error loading meeting data:', error);
    throw error;
  }
}