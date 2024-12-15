import { TopicConfig } from '@/lib/types/transcript';

export const topicConfig: TopicConfig = {
  'TECHNOLOGY': {
    color: '#10b981', // Emerald`
    label: 'Technical Implementation',
    subtopics: {
      'ASR': {
        label: 'Speech Recognition',
        items: ['processing', 'accuracy']
      },
      'PIPELINE': {
        label: 'Processing Pipeline',
        items: ['multi-stage', 'optimization']
      },
      'REALTIME': {
        label: 'Real-time Processing',
        items: ['immediate', 'feedback']
      }
    }
  },
  'UX': {
    color: '#ec4899', // Pink
    label: 'User Experience',
    subtopics: {
      'VIZ': {
        label: 'Visualization System',
        items: ['interactive', 'temporal']
      },
      'COGNITIVE': {
        label: 'Cognitive Load',
        items: ['clarity', 'effectiveness']
      },
      'NOTES': {
        label: 'Note Organization',
        items: ['structure', 'accessibility']
      },
      'INTERFACE': {
        label: 'Interface Design',
        items: ['adaptability', 'intuitiveness']
      }
    }
  },
  'VISION': {
    color: '#8b5cf6', // Purple
    label: 'Project Vision',
    subtopics: {
      'KNOWLEDGE': {
        label: 'Knowledge Transfer',
        items: ['learning', 'sharing']
      },
      'PATTERNS': {
        label: 'Pattern Recognition',
        items: ['insights', 'connections']
      },
      'ACTIVE': {
        label: 'Active Learning',
        items: ['engagement', 'adaptation']
      },
      'CROSS': {
        label: 'Cross-domain Impact',
        items: ['applications', 'scalability']
      }
    }
  },
  'PLANNING': {
    color: '#f59e0b', // Amber
    label: 'Planning',
    subtopics: {
      'MARKET': {
        label: 'Market Strategy',
        items: ['segments', 'positioning']
      },
      'DEV': {
        label: 'Development Focus',
        items: ['priorities', 'implementation']
      },
      'TEAM': {
        label: 'Team Coordination',
        items: ['roles', 'collaboration']
      }
    }
  },
  'OTHER': {  // Keeping this for backward compatibility
    color: '#94a3b8', // Slate
    label: 'Other Topics',
    subtopics: {
      'GENERAL': {
        label: 'General Discussion',
        items: ['introduction', 'misc']
      }
    }
  }
};