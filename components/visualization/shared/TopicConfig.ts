import { TopicConfig } from '@/lib/types/transcript';

export const topicConfig: TopicConfig = {
  'UX': {
    color: '#ec4899', // Pink
    label: 'User Experience',
    subtopics: {
      'INTERFACE': {
        label: 'Interface Design',
        items: ['visualization', 'interaction']
      },
      'USABILITY': {
        label: 'Usability',
        items: ['feedback', 'clarity']
      }
    }
  },
  'TECHNOLOGY': {
    color: '#10b981', // Emerald
    label: 'Technical Implementation',
    subtopics: {
      'ASR': {
        label: 'Speech Processing',
        items: ['diarization', 'accuracy']
      },
      'ARCH': {
        label: 'Architecture',
        items: ['pipeline', 'integration']
      }
    }
  },
  'PLANNING': {
    color: '#f59e0b', // Amber
    label: 'Planning',
    subtopics: {
      'ROADMAP': {
        label: 'Development Roadmap',
        items: ['priorities', 'testing']
      },
      'ROLES': {
        label: 'Team Coordination',
        items: ['tasks', 'collaboration']
      }
    }
  },
  'VISION': {
    color: '#8b5cf6', // Purple
    label: 'Project Vision',
    subtopics: {
      'GOALS': {
        label: 'Core Goals',
        items: ['knowledge sharing', 'understanding']
      },
      'FUTURE': {
        label: 'Future Development',
        items: ['expansion', 'applications']
      }
    }
  },
  'OTHER': {
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