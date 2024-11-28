// /components/visualization/shared/TopicConfig.ts
import { TopicConfig } from '@/lib/types/transcript';

export const topicConfig: TopicConfig = {
  'ASR': { 
    color: '#4f46e5',  // Deep blue
    label: 'Speech Recognition'
  },
  'VIZ': { 
    color: '#ec4899',  // Pink
    label: 'Visualization'
  },
  'TECH': { 
    color: '#10b981',  // Emerald
    label: 'Technical Implementation'
  },
  'PLAN': { 
    color: '#f59e0b',  // Amber
    label: 'Planning & Coordination'
  },
  'VISION': {
    color: '#8b5cf6',  // Purple
    label: 'Project Vision'
  }
};