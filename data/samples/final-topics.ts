import { TopicNode, ExplicitConnection, ImplicitConnection } from '@/lib/types/transcript';

export const sampleNodes: TopicNode[] = [
  // Main topics
  {
    id: 'TECHNOLOGY',
    label: 'Technical Implementation',
    type: 'main',
    topicKey: 'TECHNOLOGY',
    summary: {
      brief: 'Core technical architecture and implementation',
      details: {
        keyPoints: [
          'Custom ASR model outperforming Whisper',
          'Multi-stage processing pipeline',
          'Real-time processing capabilities'
        ],
        speakers: ['Kinan', 'Qi']
      }
    }
  },
  {
    id: 'UX',
    label: 'User Experience',
    type: 'main',
    topicKey: 'UX',
    summary: {
      brief: 'User interface and interaction design',
      details: {
        keyPoints: [
          'Interactive visualization system',
          'Cognitive load optimization',
          'Interface adaptability for different users'
        ],
        speakers: ['Ewa', 'Muhammad']
      }
    }
  },
  {
    id: 'VISION',
    label: 'Project Vision',
    type: 'main',
    topicKey: 'VISION',
    summary: {
      brief: 'Long-term goals and project direction',
      details: {
        keyPoints: [
          'Knowledge transfer across domains',
          'Pattern recognition in learning',
          'Active learning principles'
        ],
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'PLANNING',
    label: 'Planning',
    type: 'main',
    topicKey: 'PLANNING',
    summary: {
      brief: 'Strategic planning and development roadmap',
      details: {
        keyPoints: [
          'Market strategy and positioning',
          'Development priorities',
          'Team coordination'
        ],
        speakers: ['Qi', 'Kinan']
      }
    }
  },

  // Technology subtopics
  {
    id: 'TECHNOLOGY_ASR',
    label: 'Speech Recognition',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY',
    summary: {
      brief: 'Advanced speech recognition capabilities',
      details: {
        keyPoints: [
          'Japanese ASR model development',
          'Speaker diarization system',
          'Performance improvements over Whisper'
        ],
        timestamp: '[02:48-02:58]',
        speakers: ['Kinan']
      }
    }
  },
  {
    id: 'TECHNOLOGY_PIPELINE',
    label: 'Processing Pipeline',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY',
    summary: {
      brief: 'Multi-stage data processing system',
      details: {
        keyPoints: [
          'Real-time processing capabilities',
          'Context preservation',
          'Integration with visualization'
        ],
        timestamp: '[07:35-08:02]',
        speakers: ['Kinan', 'Qi']
      }
    }
  },
  {
    id: 'TECHNOLOGY_REALTIME',
    label: 'Real-time Processing',
    type: 'subtopic',
    parentId: 'TECHNOLOGY',
    topicKey: 'TECHNOLOGY',
    summary: {
      brief: 'Real-time data processing and updates',
      details: {
        keyPoints: [
          'Immediate feedback system',
          'Live data integration',
          'Performance optimization'
        ],
        timestamp: '[12:38-14:15]',
        speakers: ['Ewa']
      }
    }
  },

  // UX subtopics
  {
    id: 'UX_VIZ',
    label: 'Visualization System',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX',
    summary: {
      brief: 'Interactive visualization of knowledge connections',
      details: {
        keyPoints: [
          'Interactive exploration of relationships',
          'Temporal aspect visualization',
          'Information density balance'
        ],
        timestamp: '[04:38-05:58]',
        speakers: ['Ewa']
      }
    }
  },
  {
    id: 'UX_COGNITIVE',
    label: 'Cognitive Load',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX',
    summary: {
      brief: 'Managing information complexity for users',
      details: {
        keyPoints: [
          'Information hierarchy design',
          'User cognitive resource optimization',
          'Complexity management'
        ],
        timestamp: '[09:23-10:35]',
        speakers: ['Ewa']
      }
    }
  },
  {
    id: 'UX_NOTES',
    label: 'Note Organization',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX',
    summary: {
      brief: 'Efficient note-taking and organization',
      details: {
        keyPoints: [
          'Structured information capture',
          'Knowledge organization',
          'Easy retrieval system'
        ],
        timestamp: '[00:12-00:32]',
        speakers: ['Muhammad', 'Ewa']
      }
    }
  },
  {
    id: 'UX_INTERFACE',
    label: 'Interface Design',
    type: 'subtopic',
    parentId: 'UX',
    topicKey: 'UX',
    summary: {
      brief: 'User interface design principles',
      details: {
        keyPoints: [
          'Intuitive interaction patterns',
          'Visual clarity',
          'Responsive design'
        ],
        timestamp: '[17:03-18:12]',
        speakers: ['Ewa']
      }
    }
  },

  // Vision subtopics
  {
    id: 'VISION_KNOWLEDGE',
    label: 'Knowledge Transfer',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION',
    summary: {
      brief: 'Effective knowledge sharing and transfer',
      details: {
        keyPoints: [
          'Multilingual knowledge sharing',
          'Cross-cultural understanding',
          'Learning optimization'
        ],
        timestamp: '[02:48-04:25]',
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'VISION_PATTERNS',
    label: 'Pattern Recognition',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION',
    summary: {
      brief: 'Advanced pattern recognition system',
      details: {
        keyPoints: [
          'CRCC research implementation',
          'Cognitive pattern analysis',
          'Connection discovery'
        ],
        timestamp: '[06:10-07:35]',
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'VISION_ACTIVE',
    label: 'Active Learning',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION',
    summary: {
      brief: 'Active learning and engagement',
      details: {
        keyPoints: [
          'Dynamic learning process',
          'User engagement optimization',
          'Continuous improvement'
        ],
        timestamp: '[15:25-16:48]',
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'VISION_CROSS',
    label: 'Cross-domain Impact',
    type: 'subtopic',
    parentId: 'VISION',
    topicKey: 'VISION',
    summary: {
      brief: 'Cross-domain applications and impact',
      details: {
        keyPoints: [
          'Academic applications',
          'Industry implementation',
          'Scalable solutions'
        ],
        timestamp: '[08:18-09:23]',
        speakers: ['Qi']
      }
    }
  },

  // Planning subtopics
  {
    id: 'PLANNING_MARKET',
    label: 'Market Strategy',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING',
    summary: {
      brief: 'Market positioning and strategy',
      details: {
        keyPoints: [
          'Academic market focus',
          'Corporate applications',
          'Market differentiation'
        ],
        timestamp: '[08:18-09:23]',
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'PLANNING_DEV',
    label: 'Development Focus',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING',
    summary: {
      brief: 'Development priorities and focus',
      details: {
        keyPoints: [
          'Feature prioritization',
          'Technical roadmap',
          'Resource allocation'
        ],
        timestamp: '[20:55-21:58]',
        speakers: ['Qi']
      }
    }
  },
  {
    id: 'PLANNING_TEAM',
    label: 'Team Coordination',
    type: 'subtopic',
    parentId: 'PLANNING',
    topicKey: 'PLANNING',
    summary: {
      brief: 'Team roles and collaboration',
      details: {
        keyPoints: [
          'Role definition',
          'Collaboration structure',
          'Knowledge sharing'
        ],
        timestamp: '[21:58-23:25]',
        speakers: ['Kinan', 'Ewa', 'Qi']
      }
    }
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
  {
    source: 'TECHNOLOGY_ASR_DIARIZATION',
    target: 'UX_VIZ',
    type: 'explicit',
    speaker: 'Kinan',
    content: 'Speaker tracking visualization in real-time'
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