import { TopicConfig } from '@/lib/types/transcript';

export const topicConfig: TopicConfig = {
  'TECH': {
    color: '#10b981', // Emerald
    label: 'Technical Implementation',
    subtopics: {
      'ASR': {
        label: 'Speech Recognition',
        items: ['real-time', 'offline']
      },
      'REALTIME': {
        label: 'Real-time Processing',
        items: ['performance', 'accuracy']
      }
    }
  },
  'VIZ': {
    color: '#ec4899', // Pink
    label: 'Visualization',
    subtopics: {
      'FLOW': {
        label: 'Timeline View',
        items: ['segments', 'interactions']
      },
      'TOPIC': {
        label: 'Topic Map',
        items: ['layout', 'connections']
      }
    }
  },
  'VISION': {
    color: '#8b5cf6', // Purple
    label: 'Project Vision',
    subtopics: {
      'COGNITIVE': {
        label: 'Cognitive Load',
        items: ['complexity', 'usability']
      },
      'UX': {
        label: 'User Experience',
        items: ['interface', 'interactions']
      }
    }
  },
  'PLAN': {
    color: '#f59e0b', // Amber
    label: 'Planning & Coordination',
    subtopics: {
      'TIMELINE': {
        label: 'Project Timeline',
        items: ['milestones', 'deadlines']
      },
      'TEAM': {
        label: 'Team Organization',
        items: ['roles', 'tasks']
      }
    }
  }
};