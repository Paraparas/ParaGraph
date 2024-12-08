export const llmConfig = {
    model: 'gpt-4o-mini-2024-07-18',
    temperature: 0.3,
    maxTokens: 4000,
    timeout: 30000,
    retryAttempts: 2,
    topics: {
      VISION: { 
        color: '#4f46e5',
        label: 'Project Vision & Overview'
      },
      TECH: { 
        color: '#ec4899',
        label: 'Technical Implementation'
      },
      VIZ: { 
        color: '#10b981',
        label: 'Visualization Design'
      },
      PLAN: { 
        color: '#f59e0b',
        label: 'Planning & Coordination'
      }
    }
  } as const;  // Make it readonly