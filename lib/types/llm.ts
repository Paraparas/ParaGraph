export interface LLMConfig {
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens?: number;
    topics: {
      [key: string]: {
        color: string;
        label: string;
      }
    };
    timeout?: number;
    retryAttempts?: number;
  }
  
  export interface ProcessingResponse {
    success: boolean;
    data?: any;
    error?: string;
    processingTime?: number;
    status: 'completed' | 'failed' | 'partial';
  }
  
  export interface PromptTemplate {
    system: string;
    user: string;
    examples?: Array<{
      user: string;
      assistant: string;
    }>;
  }
  
  export interface ProcessingStage {
    name: 'parsing' | 'topic_classification' | 'summarization';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    startTime?: number;
    endTime?: number;
    error?: string;
  }