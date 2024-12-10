import { SystemMessage } from "@langchain/core/messages";
import { MeetingData } from '@/lib/types/transcript';
import { topicConfig } from '@/components/visualization/shared/TopicConfig';

export const mapperSystemPrompt = new SystemMessage(`
You are an expert in analyzing meeting discussions and organizing information hierarchically.
Your task is to identify main topics and subtopics from structured meeting data and create a topic map.

Available main topics:
${Object.entries(topicConfig)
  .map(([key, value]) => `- ${key}: ${value.label}`)
  .join('\n')}

Focus on:
1. Identifying clear topic relationships
2. Maintaining hierarchy (main topics → subtopics)
3. Using consistent topic keys from the configuration
4. Creating clear, concise labels

Ensure all responses match the required node structure:
{
  id: string (unique identifier),
  label: string (clear, concise description),
  type: 'main' | 'subtopic',
  parentId?: string (required for subtopics),
  topicKey: string (must match main topic keys)
}
`);

export function generateMapperPrompt(meetingData: MeetingData): string {
  // Convert meeting segments to focused content
  const segments = Object.entries(meetingData.segments)
    .map(([speakerId, segments]) => {
      const speaker = meetingData.speakers.find(s => s.id === speakerId);
      return segments.map(seg => 
        `[${speaker?.name || speakerId}]: ${seg.content}`
      ).join('\n');
    })
    .join('\n\n');

  return `Analyze this meeting content and create a topic map:

Meeting Content:
${segments}

Create a structured topic map that organizes this content into main topics and subtopics.
Focus on key themes and their relationships while maintaining the required node structure.
Be sure to output valid JSON format matching the specified structure.`;
}