import { TopicNode, ExplicitConnection, ImplicitConnection } from '@/lib/types/transcript';

export const sampleNodes: TopicNode[] = [
  // Main topics
  {
    id: 'TECH',
    label: 'Technical Implementation',
    type: 'main',
    topicKey: 'TECH'
  },
  {
    id: 'VIZ',
    label: 'Visualization',
    type: 'main',
    topicKey: 'VIZ'
  },
  {
    id: 'VISION',
    label: 'Project Vision',
    type: 'main',
    topicKey: 'VISION'
  },
  {
    id: 'PLAN',
    label: 'Planning',
    type: 'main',
    topicKey: 'PLAN'
  },

  // Tech subtopics
  {
    id: 'TECH_ASR',
    label: 'Speech Recognition',
    type: 'subtopic',
    parentId: 'TECH',
    topicKey: 'TECH'
  },
  {
    id: 'TECH_DIARIZATION',
    label: 'Speaker Diarization',
    type: 'subtopic',
    parentId: 'TECH',
    topicKey: 'TECH'
  },
  {
    id: 'TECH_TOPIC_DETECT',
    label: 'Topic Detection',
    type: 'subtopic',
    parentId: 'TECH',
    topicKey: 'TECH'
  },
  {
    id: 'TECH_VOCAB',
    label: 'Technical Vocabulary',
    type: 'subtopic',
    parentId: 'TECH',
    topicKey: 'TECH'
  },

  // Visualization subtopics
  {
    id: 'VIZ_FLOW',
    label: 'Temporal Flow',
    type: 'subtopic',
    parentId: 'VIZ',
    topicKey: 'VIZ'
  },
  {
    id: 'VIZ_TRANSITIONS',
    label: 'View Transitions',
    type: 'subtopic',
    parentId: 'VIZ',
    topicKey: 'VIZ'
  },
  {
    id: 'VIZ_KNOWLEDGE',
    label: 'Knowledge Evolution',
    type: 'subtopic',
    parentId: 'VIZ',
    topicKey: 'VIZ'
  },

  // Vision subtopics
  {
    id: 'VISION_CORE',
    label: 'Core Vision',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },
  {
    id: 'VISION_QUALITY',
    label: 'Data Quality',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },

  // Planning subtopics
  {
    id: 'PLAN_TEST',
    label: 'Testing Strategy',
    type: 'subtopic',
    parentId: 'PLAN',
    topicKey: 'PLAN'
  },
  {
    id: 'PLAN_NEXT',
    label: 'Next Steps',
    type: 'subtopic',
    parentId: 'PLAN',
    topicKey: 'PLAN'
  }
];

export const explicitConnections: ExplicitConnection[] = [
    // TECH connections
    {
      source: 'TECH_ASR',
      target: 'TECH',
      type: 'explicit',
      speaker: 'Kinan',
      content: 'Discussing real-time speech processing and innovations'
    },
    {
      source: 'TECH_DIARIZATION',
      target: 'TECH',
      type: 'explicit',
      speaker: 'Kinan',
      content: 'Explaining speaker diarization for tracking speakers'
    },
    {
      source: 'TECH_TOPIC_DETECT',
      target: 'TECH',
      type: 'explicit',
      speaker: 'Kinan',
      content: 'Discussing topic detection and semantic similarity'
    },
    {
      source: 'TECH_VOCAB',
      target: 'TECH',
      type: 'explicit',
      speaker: 'Kinan',
      content: 'Implementing domain-specific vocabulary system'
    },
  
    // VIZ connections
    {
      source: 'VIZ_FLOW',
      target: 'VIZ',
      type: 'explicit',
      speaker: 'Ewa',
      content: 'Designing temporal flow visualization with parallel lanes'
    },
    {
      source: 'VIZ_TRANSITIONS',
      target: 'VIZ',
      type: 'explicit',
      speaker: 'Ewa',
      content: 'Implementing smooth morphing animations between views'
    },
    {
      source: 'VIZ_KNOWLEDGE',
      target: 'VIZ',
      type: 'explicit',
      speaker: 'Qi',
      content: 'Explaining knowledge graph evolution across sessions'
    },
  
    // VISION connections
    {
      source: 'VISION_CORE',
      target: 'VISION',
      type: 'explicit',
      speaker: 'Qi',
      content: 'Explaining ParaGraph\'s core vision of meeting visualization'
    },
    {
      source: 'VISION_QUALITY',
      target: 'VISION',
      type: 'explicit',
      speaker: 'Ewa',
      content: 'Emphasizing data quality for visualization effectiveness'
    },
  
    // PLAN connections
    {
      source: 'PLAN_TEST',
      target: 'PLAN',
      type: 'explicit',
      speaker: 'Ewa',
      content: 'Outlining testing priorities for temporal flow'
    },
    {
      source: 'PLAN_NEXT',
      target: 'PLAN',
      type: 'explicit',
      speaker: 'Qi',
      content: 'Setting clear next steps for team members'
    }
  ];

export const implicitConnections: ImplicitConnection[] = [
  {
    source: 'TECH_ASR',
    target: 'VIZ_FLOW',
    type: 'implicit',
    insight: 'Real-time processing affects visualization responsiveness',
    importance: 'Critical for seamless user experience'
  },
  {
    source: 'TECH_TOPIC_DETECT',
    target: 'VIZ_KNOWLEDGE',
    type: 'implicit',
    insight: 'Topic detection enables knowledge graph evolution',
    importance: 'Foundation for tracking idea development'
  },
  {
    source: 'VISION_QUALITY',
    target: 'PLAN_TEST',
    type: 'implicit',
    insight: 'Data quality priorities inform testing strategy',
    importance: 'Ensures reliable system performance'
  },
  {
    source: 'VIZ_TRANSITIONS',
    target: 'VISION_CORE',
    type: 'implicit',
    insight: 'Smooth transitions support core vision of accessible content',
    importance: 'Enhances user understanding of complex information'
  },
  {
    source: 'TECH_DIARIZATION',
    target: 'VIZ_KNOWLEDGE',
    type: 'implicit',
    insight: 'Speaker identification enriches knowledge tracking',
    importance: 'Enables analysis of contribution patterns'
  }
];