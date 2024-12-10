// /data/samples/sample-meeting.ts
import { TopicConfig, Speaker, MeetingData } from '../../lib/types/transcript';

// export const topicConfig: TopicConfig = {
//   VISION: { 
//     color: '#4f46e5',
//     label: 'Project Vision & Overview'
//   },
//   TECH: { 
//     color: '#ec4899',
//     label: 'Technical Implementation'
//   },
//   VIZ: { 
//     color: '#10b981',
//     label: 'Visualization Design'
//   },
//   PLAN: { 
//     color: '#f59e0b',
//     label: 'Planning & Coordination'
//   }
// };

export const sampleMeetingData: MeetingData = {
  speakers: [
    { id: 'M', name: 'Muhammad' },
    { id: 'K', name: 'Kinan' },
    { id: 'E', name: 'Ewa' },
    { id: 'Q', name: 'Qi' }
  ],
  segments: {
    'M': [
      {
        topic: 'VISION',
        start: 0,
        duration: 12,
        content: "Thanks for having this onboarding meeting. I've reviewed the roadmap, but I'd love to understand how everything fits together. What's our core focus for the hackathon demo?",
        briefSummary: "Requests overview of hackathon demo focus",
        detailedSummary: [
          "Acknowledges reviewing roadmap",
          "Seeks understanding of project integration",
          "Asks about hackathon demo priorities"
        ]
      },
      {
        topic: 'VIZ',
        start: 84,
        duration: 11,
        content: "That sounds powerful. How do we handle transitions between different visualization layers?",
        briefSummary: "Questions visualization layer transitions",
        detailedSummary: [
          "Shows interest in visualization capabilities",
          "Focuses on transition mechanisms between views"
        ]
      },
      {
        topic: 'PLAN',
        start: 175,
        duration: 12,
        content: "Should I focus on any specific aspect during testing?",
        briefSummary: "Asks for testing focus areas",
        detailedSummary: [
          "Seeks clarity on testing priorities",
          "Shows readiness to contribute"
        ]
      }
    ],
    'K': [
      {
        topic: 'TECH',
        start: 31,
        duration: 27,
        content: "Sure. We're using real-time speech processing with two key innovations. First, we're implementing speaker diarization to track who's talking when. Second, we're using topic detection to color-code different discussion themes. The challenge is maintaining accuracy while processing in real-time. Ewa, this connects directly to your visualization work, especially for the temporal flow view.",
        briefSummary: "Explains speech processing implementation",
        detailedSummary: [
          "Details real-time speech processing features",
          "Highlights speaker diarization implementation",
          "Describes topic detection and color coding",
          "Mentions challenges with real-time accuracy",
          "Connects to visualization requirements"
        ]
      },
      {
        topic: 'TECH',
        start: 122,
        duration: 26,
        content: "Interesting idea, Ewa! We could map confidence scores to visual properties. Actually, I've been thinking about topic detection too. Instead of fixed categories, we could dynamically generate topic clusters based on semantic similarity. Qi, this might help with your vision for knowledge graph generation.",
        briefSummary: "Proposes advanced topic detection features",
        detailedSummary: [
          "Suggests mapping confidence scores to visuals",
          "Proposes dynamic topic clustering",
          "Links to knowledge graph generation"
        ]
      },
      {
        topic: 'TECH',
        start: 213,
        duration: 26,
        content: "And while testing the ASR, pay attention to how well it handles technical terms. I'm implementing a domain-specific vocabulary system, but we need to balance accuracy with processing speed. Qi, should we prioritize real-time processing or accuracy for the demo?",
        briefSummary: "Discusses ASR testing priorities",
        detailedSummary: [
          "Focuses on technical term handling",
          "Mentions domain-specific vocabulary system",
          "Raises processing speed vs accuracy trade-off"
        ]
      }
    ],
    'E': [
      {
        topic: 'VIZ',
        start: 58,
        duration: 26,
        content: "Exactly, Kinan. The temporal flow view is our first layer of visualization. I'm designing it to show speaker contributions as parallel lanes, with topic-based color coding. The key is making complex information instantly graspable. Muhammad, imagine uploading a meeting recording and immediately seeing how topics flow between speakers.",
        briefSummary: "Describes temporal flow visualization",
        detailedSummary: [
          "Explains parallel lanes for speakers",
          "Details topic-based color coding",
          "Emphasizes intuitive information display"
        ]
      },
      {
        topic: 'VIZ',
        start: 95,
        duration: 27,
        content: "Great point! We're using smooth morphing animations between views. When users switch from temporal flow to topic map, topics maintain their color coding but reorganize spatially to show relationships. Kinan, I'm curious - could we use the ASR confidence scores to adjust visualization opacity?",
        briefSummary: "Details visualization transitions",
        detailedSummary: [
          "Describes morphing animations",
          "Explains topic map reorganization",
          "Suggests ASR confidence visualization"
        ]
      },
      {
        topic: 'PLAN',
        start: 187,
        duration: 26,
        content: "Focus first on the temporal flow view. Watch how topic transitions appear, check if the speaker lanes are clearly distinguished. Also, we're adding interactive features - hovering over a topic highlights related segments across speakers. Think about what would help you understand meeting content quickly.",
        briefSummary: "Provides testing guidance",
        detailedSummary: [
          "Prioritizes temporal flow testing",
          "Details specific testing areas",
          "Describes interactive features",
          "Emphasizes user comprehension"
        ]
      },
      {
        topic: 'PLAN',
        start: 265,
        duration: 17,
        content: "Agreed. Clean data will help us showcase the core value proposition. Muhammad, we can start you with some pre-recorded test meetings to establish our baseline visualization performance.",
        briefSummary: "Confirms testing approach",
        detailedSummary: [
          "Emphasizes data quality importance",
          "Suggests using pre-recorded meetings",
          "Plans for baseline performance testing"
        ]
      }
    ],
    'Q': [
      {
        topic: 'VISION',
        start: 12,
        duration: 19,
        content: "Great question, Muhammad. ParaGraph transforms meeting discussions into visual knowledge maps. Think of it as a dynamic way to understand team conversations. For the hackathon, we're focusing on three key components: ASR integration, visualization architecture, and insights generation. Kinan, want to walk us through the ASR part?",
        briefSummary: "Outlines project vision and focus areas",
        detailedSummary: [
          "Explains ParaGraph's core concept",
          "Lists three key hackathon components",
          "Transitions to technical discussion"
        ]
      },
      {
        topic: 'VISION',
        start: 148,
        duration: 27,
        content: "Absolutely! That ties into our bigger vision. Beyond just visualizing single meetings, we want to show how ideas evolve across multiple sessions. The knowledge graph becomes this living map of team expertise. Muhammad, you'll be helping us test these different visualization layers.",
        briefSummary: "Explains long-term vision",
        detailedSummary: [
          "Describes multi-meeting visualization",
          "Introduces knowledge graph concept",
          "Assigns testing responsibilities"
        ]
      },
      {
        topic: 'PLAN',
        start: 239,
        duration: 26,
        content: "For the hackathon demo, let's prioritize accuracy. We can show real-time capabilities as a stretch goal. The key is demonstrating how ParaGraph makes meeting content more accessible and actionable. Ewa's visualization needs clean data to really shine.",
        briefSummary: "Sets demo priorities",
        detailedSummary: [
          "Prioritizes accuracy over real-time processing",
          "Focuses on accessibility and actionability",
          "Emphasizes visualization requirements"
        ]
      },
      {
        topic: 'PLAN',
        start: 282,
        duration: 18,
        content: "Perfect. Let's wrap up with clear next steps. Muhammad, focus on temporal flow testing. Kinan, refine the ASR accuracy. Ewa, polish those view transitions. We'll sync again tomorrow to check progress.",
        briefSummary: "Assigns team tasks",
        detailedSummary: [
          "Delegates specific responsibilities",
          "Sets timeline for next check-in",
          "Ensures clear action items"
        ]
      }
    ]
  }
};