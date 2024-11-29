import { PromptTemplate } from '../types/llm';
import { llmConfig } from '../../config/llm';

const topicsList = Object.entries(llmConfig.topics)
  .map(([key, value]) => `- ${key}: ${value.label}`)
  .join('\n');

export const transcriptAnalysisPrompts: PromptTemplate = {
  system: `You are an expert in analyzing meeting transcripts and extracting structured information.
Your task is to parse a meeting transcript and output structured JSON data with speaker information, 
timestamps, topics, and summaries.

For speaker information, identify:
- Unique ID (single letter used in transcript)
- Full name (extract from context, usually mentioned at start)
- Role (if mentioned)

For each speech segment:
- Parse exact timestamps [MM:SS-MM:SS]
- Calculate duration in seconds
- Ensure chronological order for each speaker
- Convert time format to seconds from start

Topic Classification:
VISION: Project vision, goals, overview, future direction
TECH: Technical implementation, system architecture, coding details
VIZ: User interface, visualization features, design elements
PLAN: Task coordination, timelines, assignments, next steps

The output must conform to a specific data structure that will be provided.`,

  user: `Parse this meeting transcript and provide a JSON output with:
1. Speaker list with IDs, names, and roles
2. Chronological segments by speaker
3. Topic classification
4. Brief and detailed summaries

JSON output must match this structure:
{
  "speakers": [
    {
      "id": string,     // e.g., "M"
      "name": string,   // e.g., "Muhammad"
      "role": string    // e.g., "New Team Member"
    }
  ],
  "segments": {
    "speakerId": [     // Array of segments grouped by speaker
      {
        "topic": "VISION" | "TECH" | "VIZ" | "PLAN",
        "start": number,  // seconds from start
        "duration": number,
        "content": string,
        "briefSummary": string,    // 5-8 words
        "detailedSummary": string[] // 2-4 bullet points
      }
    ]
  }
}

Please parse this transcript into the specified JSON format:
[Transcript segment will be inserted here]`,

  examples: [{
    user: `[00:00-00:12] M: "Thanks for having this onboarding meeting. I've reviewed the roadmap, but I'd love to understand how everything fits together. What's our core focus for the hackathon demo?"`,
    assistant: `{
      "speakers": [{
        "id": "M",
        "name": "Muhammad",
        "role": "New Team Member"
      }],
      "segments": {
        "M": [{
          "topic": "VISION",
          "start": 0,
          "duration": 12,
          "content": "Thanks for having this onboarding meeting. I've reviewed the roadmap, but I'd love to understand how everything fits together. What's our core focus for the hackathon demo?",
          "briefSummary": "Requests overview of project structure",
          "detailedSummary": [
            "Acknowledges reviewing roadmap",
            "Seeks understanding of project integration",
            "Asks about hackathon demo priorities"
          ]
        }]
      }
    }`
  }]
};

export const generatePrompt = (template: PromptTemplate, input: string): string => {
  return template.user.replace('[Transcript segment will be inserted here]', input);
};