import { TopicNode, ExplicitConnection, ImplicitConnection } from '@/lib/types/transcript';

export const sampleNodes: TopicNode[] = [
  // Main topics
  {
    id: 'TECHNOLOGY',
    label: 'Technical Implementation',
    type: 'main',
    topicKey: 'TECHNOLOGY'
  },
  {
    id: 'UX',
    label: 'User Experience',
    type: 'main',
    topicKey: 'UX'
  },
  {
    id: 'VISION',
    label: 'Project Vision',
    type: 'main',
    topicKey: 'VISION'
  },
  {
    id: 'PLANNING',
    label: 'Planning',
    type: 'main',
    topicKey: 'PLANNING'
  },

  // Technology subtopics
  {
    id: 'TECHNOLOGY_ASR',
    label: 'Speech Recognition',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY'
  },
  {
    id: 'TECHNOLOGY_PIPELINE',
    label: 'Processing Pipeline',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY'
  },
  {
    id: 'TECHNOLOGY_REALTIME',
    label: 'Real-time Processing',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY'
  },
  
  // UX subtopics
  {
    id: 'UX_VIZ',
    label: 'Visualization System',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX'
  },
  {
    id: 'UX_COGNITIVE',
    label: 'Cognitive Load',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX'
  },
  {
    id: 'UX_NOTES',
    label: 'Note Organization',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX'
  },
  {
    id: 'UX_INTERFACE',
    label: 'Interface Design',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX'
  },

  // Vision subtopics
  {
    id: 'VISION_KNOWLEDGE',
    label: 'Knowledge Transfer',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },
  {
    id: 'VISION_PATTERNS',
    label: 'Pattern Recognition',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },
  {
    id: 'VISION_ACTIVE',
    label: 'Active Learning',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },
  {
    id: 'VISION_CROSS',
    label: 'Cross-domain Impact',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },

  // Planning subtopics
  {
    id: 'PLANNING_MARKET',
    label: 'Market Strategy',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING'
  },
  {
    id: 'PLANNING_DEV',
    label: 'Development Focus',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING'
  },
  {
    id: 'PLANNING_TEAM',
    label: 'Team Coordination',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING'
  }
];

export const explicitConnections: ExplicitConnection[] = [
  // Technology connections
  {
    source: 'TECHNOLOGY_ASR',
    target: 'UX_VIZ',
    type: 'explicit',
    speaker: 'Kinan',
    content: 'Integration of speech processing with rich contextual visualization'
  },
  {
    source: 'TECHNOLOGY_PIPELINE',
    target: 'VISION_PATTERNS',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Processing pipeline designed for sophisticated pattern detection'
  },
  {
    source: 'TECHNOLOGY_REALTIME',
    target: 'UX_INTERFACE',
    type: 'explicit',
    speaker: 'Ewa',
    content: 'Real-time processing enabling dynamic interface updates'
  },
  {
    source: 'TECHNOLOGY_PIPELINE',
    target: 'PLANNING_DEV',
    type: 'explicit',
    speaker: 'Kinan',
    content: 'Pipeline optimization as key development priority'
  },
  
  // UX connections
  {
    source: 'UX_VIZ',
    target: 'VISION_KNOWLEDGE',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Visualization system facilitating knowledge understanding'
  },
  {
    source: 'UX_NOTES',
    target: 'VISION_ACTIVE',
    type: 'explicit',
    speaker: 'Ewa',
    content: 'Note organization supporting active learning process'
  },
  {
    source: 'UX_INTERFACE',
    target: 'PLANNING_MARKET',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Interface adaptability for different market segments'
  },

  // Vision connections
  {
    source: 'VISION_PATTERNS',
    target: 'UX_VIZ',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Pattern recognition driving visualization insights'
  },
  {
    source: 'VISION_CROSS',
    target: 'PLANNING_MARKET',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Cross-domain applications informing market strategy'
  },
  {
    source: 'VISION_ACTIVE',
    target: 'PLANNING_DEV',
    type: 'explicit',
    speaker: 'Qi',
    content: 'Active learning principles guiding development priorities'
  }
];

export const implicitConnections: ImplicitConnection[] = [
  {
    source: 'UX_COGNITIVE',
    target: 'VISION_KNOWLEDGE',
    type: 'implicit',
    insight: 'Cognitive load optimization enhances knowledge transfer effectiveness',
    importance: 'Shows how UX decisions directly impact learning outcomes'
  },
  {
    source: 'TECHNOLOGY_PIPELINE',
    target: 'UX_VIZ',
    type: 'implicit',
    insight: 'Multi-stage processing enables sophisticated visualization capabilities',
    importance: 'Technical architecture supporting advanced user experience'
  },
  {
    source: 'VISION_PATTERNS',
    target: 'UX_NOTES',
    type: 'implicit',
    insight: 'Pattern recognition algorithms enhance note organization',
    importance: 'AI capabilities improving user productivity'
  },
  {
    source: 'UX_INTERFACE',
    target: 'VISION_CROSS',
    type: 'implicit',
    insight: 'Adaptive interface design enables cross-domain applications',
    importance: 'UX flexibility supporting broader impact'
  },
  {
    source: 'TECHNOLOGY_REALTIME',
    target: 'VISION_ACTIVE',
    type: 'implicit',
    insight: 'Real-time processing enables active learning feedback loops',
    importance: 'Technical capabilities supporting core vision'
  },
  {
    source: 'PLANNING_TEAM',
    target: 'VISION_KNOWLEDGE',
    type: 'implicit',
    insight: 'Team coordination structure reflects knowledge transfer principles',
    importance: 'Organizational alignment with product vision'
  }
];