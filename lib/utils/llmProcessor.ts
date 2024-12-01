// lib/utils/llmProcessor.ts
import OpenAI from 'openai';
import { 
  LLMConfig, 
  ProcessingResponse, 
  ProcessingStage 
} from '../types/llm';
import { 
  MeetingData,
  Speaker,
  Segment
} from '../types/transcript';
import { 
  LLMProcessingError,
  TranscriptParsingError 
} from './errors';
import { transcriptAnalysisPrompts, generatePrompt } from './prompts';
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
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: transcriptAnalysisPrompts.system },
          { role: 'user', content: generatePrompt(transcriptAnalysisPrompts, rawTranscript) }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens,
        response_format: { type: "json_object" }
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
          const outputPath = path.join(process.cwd(), 'data', 'processed', 'real1_refined.json');
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
    // Basic structure validation
    if (!response.speakers || !response.segments) {
      return false;
    }

    // Validate speakers
    if (!Array.isArray(response.speakers)) {
      return false;
    }

    // Validate each speaker
    for (const speaker of response.speakers) {
      if (!speaker.id || !speaker.name) {
        return false;
      }
    }

    // Validate segments
    for (const speakerId in response.segments) {
      if (!Array.isArray(response.segments[speakerId])) {
        return false;
      }

      // Validate each segment
      for (const segment of response.segments[speakerId]) {
        if (!segment.topic || 
            typeof segment.start !== 'number' ||
            typeof segment.duration !== 'number' ||
            !segment.content ||
            !segment.briefSummary ||
            !Array.isArray(segment.detailedSummary)) {
          return false;
        }
      }
    }

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