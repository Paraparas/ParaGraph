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
  // Tech subtopics
  {
    id: 'TECH_ASR',
    label: 'Speech Recognition',
    type: 'subtopic',
    parentId: 'TECH',
    topicKey: 'TECH'
  },
  {
    id: 'TECH_REALTIME',
    label: 'Real-time Processing',
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
    id: 'VIZ_TOPIC',
    label: 'Topic Map',
    type: 'subtopic',
    parentId: 'VIZ',
    topicKey: 'VIZ'
  },
  // Vision subtopics
  {
    id: 'VISION_COGNITIVE',
    label: 'Cognitive Load',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  },
  {
    id: 'VISION_UX',
    label: 'User Experience',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION'
  }
];

export const explicitConnections: ExplicitConnection[] = [
  {
    source: 'TECH_ASR',
    target: 'TECH',
    type: 'explicit',
    speaker: 'Kinan',
    content: 'Discussing ASR implementation challenges'
  },
  {
    source: 'VIZ_TOPIC',
    target: 'VIZ',
    type: 'explicit',
    speaker: 'Ewa',
    content: 'Explaining visualization architecture'
  }
];

export const implicitConnections: ImplicitConnection[] = [
  {
    source: 'VIZ_TOPIC',
    target: 'VISION_COGNITIVE',
    type: 'implicit',
    insight: 'Topic visualization complexity aligns with cognitive load principles',
    importance: 'Shows how technical decisions are guided by user-centric design philosophy'
  },
  {
    source: 'TECH_ASR',
    target: 'VISION_COGNITIVE',
    type: 'implicit',
    insight: 'Real-time processing decisions consider cognitive load implications',
    importance: 'Demonstrates balance between technical capabilities and user experience'
  },
  {
    source: 'VISION_UX',
    target: 'VIZ_TOPIC',
    type: 'implicit',
    insight: 'Visualization choices driven by user experience priorities',
    importance: 'Links implementation decisions to core project values'
  }
];