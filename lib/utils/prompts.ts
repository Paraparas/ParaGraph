import { PromptTemplate } from '../types/llm';
import { llmConfig } from '../../config/llm';

const topicsList = Object.entries(llmConfig.topics)
  .map(([key, value]) => `- ${key}: ${value.label}`)
  .join('\n');
  
export const refineRawTranscriptPrompt: string = `
You are a skilled transcript editor. Your task is to refine raw meeting transcripts into clear, professional documents while maintaining authenticity. Follow these specific guidelines:
1. Timestamp Formatting
- Add precise timestamps in [MM:SS] format for each speech segment
- Use realistic durations for different types of utterances:
  * Brief responses (“Yes”, “Thanks”, “Okay”): 2-5 seconds
  * Simple questions or short comments: 5-10 seconds
  * Regular explanations: 20-45 seconds
  * Complex explanations or deep dives: 60-90 seconds
- Avoid artificial patterns (don’t consistently use multiples of 15 seconds)
- Ensure timestamps flow continuously without gaps
- If the transcript already has timestamps, use those instead.
2. Speech Consolidation
- Combine adjacent speech segments from the same speaker into single, coherent statements
- Remove interruptions and overlapping timestamps
- Preserve meaningful back-and-forth exchanges
- Maintain natural conversation rhythm
3. Content Cleanup
- Remove filler words (“um”, “uh”, “like”, etc.)
- Remove false starts and repetitions
- Remove verbal acknowledgments (“yeah”, “mhm”) unless they carry meaning
- Fix grammar and sentence structure while maintaining speaker’s voice
- Keep meaningful pauses or transitions
4. Flow Enhancement
- Ensure logical progression between topics
- Maintain natural conversation dynamics
- Preserve important interjections or reactions
- Keep authentic elements that show team dynamics
5. Output Format
[00:00-00:12] Speaker1: “Clear, refined statement...”
[00:12-00:32] Speaker2: “Response or question...”
Additional Notes:
- Total duration should match original meeting length
- Maintain individual speaking styles while improving clarity
- Preserve technical terms and specific references
- Keep meaningful non-verbal indicators [laughs], [shows screen] if present
- For longer explanations, indicate topic shifts within the same speaker’s segment
Apply these guidelines while preserving the authentic character of the meeting and its participants. The goal is a professional, readable transcript that accurately represents the meeting’s content and flow.
`

export const processRefinedTranscriptPrompt: string = "Extract time-segmented summaries from meeting transcripts, including topics, timestamps, content, and speaker information."


// export const transcriptAnalysisPrompts: PromptTemplate = {
//   system: `You are an expert in analyzing meeting transcripts and extracting structured information.
// Your task is to parse a meeting transcript and output structured JSON data with speaker information, 
// timestamps, topics, and summaries.

// For speaker information, identify:
// - Unique ID (single letter used in transcript)
// - Full name (extract from context, usually mentioned at start)
// - Role (if mentioned)

// For each speech segment:
// - Parse exact timestamps [MM:SS-MM:SS]
// - Calculate duration in seconds
// - Ensure chronological order for each speaker
// - Convert time format to seconds from start

// Topic Classification:
// VISION: Project vision, goals, overview, future direction
// TECH: Technical implementation, system architecture, coding details
// VIZ: User interface, visualization features, design elements
// PLAN: Task coordination, timelines, assignments, next steps

// The output must conform to a specific data structure that will be provided.`,

//   user: `Parse this meeting transcript and provide a JSON output with:
// 1. Speaker list with IDs, names, and roles
// 2. Chronological segments by speaker
// 3. Topic classification
// 4. Brief and detailed summaries

// JSON output must match this structure:
// {
//   "speakers": [
//     {
//       "id": string,     // e.g., "M"
//       "name": string,   // e.g., "Muhammad"
//       "role": string    // e.g., "New Team Member"
//     }
//   ],
//   "segments": {
//     "speakerId": [     // Array of segments grouped by speaker
//       {
//         "topic": "VISION" | "TECH" | "VIZ" | "PLAN",
//         "start": number,  // seconds from start
//         "duration": number,
//         "content": string,
//         "briefSummary": string,    // 5-8 words
//         "detailedSummary": string[] // 2-4 bullet points
//       }
//     ]
//   }
// }

// Please parse this transcript into the specified JSON format:
// [Transcript segment will be inserted here]`,

//   examples: [{
//     user: `[00:00-00:12] M: "Thanks for having this onboarding meeting. I've reviewed the roadmap, but I'd love to understand how everything fits together. What's our core focus for the hackathon demo?"`,
//     assistant: `{
//       "speakers": [{
//         "id": "M",
//         "name": "Muhammad",
//         "role": "New Team Member"
//       }],
//       "segments": {
//         "M": [{
//           "topic": "VISION",
//           "start": 0,
//           "duration": 12,
//           "content": "Thanks for having this onboarding meeting. I've reviewed the roadmap, but I'd love to understand how everything fits together. What's our core focus for the hackathon demo?",
//           "briefSummary": "Requests overview of project structure",
//           "detailedSummary": [
//             "Acknowledges reviewing roadmap",
//             "Seeks understanding of project integration",
//             "Asks about hackathon demo priorities"
//           ]
//         }]
//       }
//     }`
//   }]
// };

// export const generatePrompt = (template: PromptTemplate, input: string): string => {
//   return template.user.replace('[Transcript segment will be inserted here]', input);
// };