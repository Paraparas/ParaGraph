export class LLMProcessingError extends Error {
    constructor(message: string, public details?: any) {
      super(message);
      this.name = 'LLMProcessingError';
    }
  }
  
  export class TranscriptParsingError extends LLMProcessingError {
    constructor(message: string, public details?: any) {
      super(message);
      this.name = 'TranscriptParsingError';
    }
  }
  
  export class TopicClassificationError extends LLMProcessingError {
    constructor(message: string, public details?: any) {
      super(message);
      this.name = 'TopicClassificationError';
    }
  }
  
  export class SummarizationError extends LLMProcessingError {
    constructor(message: string, public details?: any) {
      super(message);
      this.name = 'SummarizationError';
    }
  }