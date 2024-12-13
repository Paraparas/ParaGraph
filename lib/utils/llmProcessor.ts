// lib/utils/llmProcessor.ts
import OpenAI from 'openai';
import { 
  LLMConfig, 
  ProcessingResponse, 
  ProcessingStage
} from '../types/llm';
import transcriptSchema from '../types/transcriptSchema';
import { 
  MeetingData,
  Speaker,
  Segment
} from '../types/transcript';
import { 
  LLMProcessingError,
  TranscriptParsingError 
} from './errors';
import { transcriptSystemPrompt } from './prompts';
import { llmConfig } from '../../config/llm';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export class TranscriptProcessor {
  private openai: OpenAI;
  private config: LLMConfig;
  private processingStages: ProcessingStage[] = [];

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined in environment');
    
    this.openai = new OpenAI({ apiKey });
    this.config = {
      apiKey,
      model: llmConfig.model,
      temperature: llmConfig.temperature,
      maxTokens: llmConfig.maxTokens,
      topics: llmConfig.topics,
      timeout: llmConfig.timeout,
      retryAttempts: llmConfig.retryAttempts
    };
  }

  async processTranscript(rawTranscript: string): Promise<ProcessingResponse> {
    try {
      this.processingStages = [];
      this.updateStage('parsing', 'processing');
      console.log('Current NODE_ENV:', process.env.NODE_ENV);

      // Process with LLM
      const completion = await this.openai.beta.chat.completions.parse({
        model: this.config.model,
        messages: [
          { role: 'system', content: transcriptSystemPrompt },
          { role: 'user', content: rawTranscript }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        response_format: { 
          type: "json_schema",
          json_schema: transcriptSchema
        }
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new LLMProcessingError('No response from LLM');
      }

      const parsedResponse = JSON.parse(response);
      
      // Validate the response structure
      if (!this.validateResponse(parsedResponse)) {
        throw new LLMProcessingError('Invalid response structure from LLM');
      }

      // Save processed data in development mode
      if (process.env.NODE_ENV === 'development') {
        try {
          const outputPath = path.join(process.cwd(), 'data', 'processed', 'final-processed.json');
          await mkdir(path.join(process.cwd(), 'data', 'processed'), { recursive: true });
          await writeFile(
            outputPath,
            JSON.stringify(parsedResponse, null, 2),
            'utf-8'
          );
          console.log('Processed data saved to:', outputPath);
        } catch (error) {
          console.error('Error saving processed data:', error);
        }
      }

      this.updateStage('parsing', 'completed');

      return {
        success: true,
        data: parsedResponse as MeetingData,
        status: 'completed',
        processingTime: Date.now() - (this.processingStages[0]?.startTime || Date.now())
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.updateStage('parsing', 'failed', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        status: 'failed',
        processingTime: Date.now() - (this.processingStages[0]?.startTime || Date.now())
      };
    }
  }

  private validateResponse(response: any): response is MeetingData {
    return true;
  }

  private updateStage(name: ProcessingStage['name'], status: ProcessingStage['status'], error?: string) {
    const stage = this.processingStages.find(s => s.name === name);
    if (stage) {
      stage.status = status;
      stage.error = error;
      stage.endTime = Date.now();
    } else {
      this.processingStages.push({
        name,
        status,
        startTime: Date.now(),
        error
      });
    }
  }
}