import { TopicConfig } from '@/lib/types/transcript';

export const topicConfig: TopicConfig = {
  'TECH': {
    color: '#10b981', // Emerald
    label: 'Technical Implementation',
    subtopics: {
      'ASR': {
        label: 'Speech Recognition',
        items: ['real-time', 'offline', 'vocabulary']
      },
      'ARCH': {
        label: 'Architecture',
        items: ['api', 'database', 'deployment']
      }
    }
  },
  'VIZ': {
    color: '#ec4899', // Pink
    label: 'Visualization',
    subtopics: {
      'TIMELINE': {
        label: 'Timeline View',
        items: ['segments', 'interactions']
      },
      'TOPIC': {
        label: 'Topic Map',
        items: ['layout', 'connections']
      }
    }
  },
  'PLAN': {
    color: '#f59e0b', // Amber
    label: 'Planning & Coordination',
    subtopics: {
      'TIMELINE': {
        label: 'Timeline',
        items: ['milestones', 'tasks']
      },
      'TEAM': {
        label: 'Team Organization',
        items: ['roles', 'communication']
      }
    }
  },
  'VISION': {
    color: '#8b5cf6', // Purple
    label: 'Project Vision',
    subtopics: {
      'GOALS': {
        label: 'Goals',
        items: ['short-term', 'long-term']
      },
      'IMPACT': {
        label: 'Impact',
        items: ['user-value', 'innovation']
      }
    }
  }
};