// lib/utils/llmProcessor.ts
import OpenAI from 'openai';
import { 
  LLMConfig, 
  ProcessingResponse, 
  ProcessingStage
} from '../types/llm';
import timelineViewSchema from '../types/timelineViewSchema';
import quickViewSchema from '../types/quickViewSchema';
import { 
  MeetingData,
  Speaker,
  Segment
} from '../types/transcript';
import { 
  LLMProcessingError,
  TranscriptParsingError 
} from './errors';
import { refineRawTranscriptPrompt, timelineViewPrompt, quickViewPrompt } from './prompts';
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

  async refineRawTranscript(rawTranscript: string): Promise<string> {
    try {
      console.log('Starting refinement of raw transcript');
  
      // Determine the maximum input size for the API
      const maxInputLength = llmConfig.maxTokens * 4; // Approx. 4 chars per token
  
      let finalRefinedTranscript: string;
  
      // If the transcript is too long, split it into chunks
      if (rawTranscript.length > maxInputLength) {
        console.log('Transcript is too long; splitting into chunks');
        
        // Split the raw transcript into chunks
        const chunks = this.splitTranscriptIntoChunks(rawTranscript, maxInputLength);
  
        // Process each chunk
        const refinedChunks: string[] = [];
        for (const chunk of chunks) {
          console.log('Processing chunk:', chunk.slice(0, 100), '...'); // Log first 100 chars of the chunk
          const refinedChunk = await this.processTranscriptChunk(chunk);
          refinedChunks.push(refinedChunk);
        }
  
        // Combine the refined chunks into the final refined transcript
        finalRefinedTranscript = refinedChunks.join('\n\n');
      } else {
        // If the transcript is short enough, process it directly
        finalRefinedTranscript = await this.processTranscriptChunk(rawTranscript);
      }
  
      // Save the refined transcript to a file in development mode
      await this.saveRefinedTranscriptToFile(finalRefinedTranscript);
  
      console.log('Refinement completed successfully');
      return finalRefinedTranscript;
  
    } catch (error) {
      console.error('Error refining raw transcript:', error);
      throw new TranscriptParsingError(
        error instanceof Error ? error.message : 'Unknown error occurred during refinement'
      );
    }
  }

  private async saveRefinedTranscriptToFile(refinedText: string): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      try {
        const outputPath = path.join(process.cwd(), 'data', 'processed', 'refined-transcript.txt');
        await mkdir(path.join(process.cwd(), 'data', 'processed'), { recursive: true });
        await writeFile(outputPath, refinedText, 'utf-8');
        console.log('Processed data saved to:', outputPath);
      } catch (error) {
        console.error('Error saving processed data:', error);
      }
    }
  }
  
  private splitTranscriptIntoChunks(rawTranscript: string, maxInputLength: number): string[] {
    const sentences = rawTranscript.split(/(?<=\.\s|\n)/); // Split by sentences or newlines
    const chunks: string[] = [];
    let currentChunk = '';
  
    for (const sentence of sentences) {
      // Add the sentence to the current chunk if it fits
      if (currentChunk.length + sentence.length <= maxInputLength) {
        currentChunk += sentence;
      } else {
        // Push the current chunk and start a new one
        chunks.push(currentChunk);
        currentChunk = sentence;
      }
    }
  
    // Add the last chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }
  
    return chunks;
  }

  private async processTranscriptChunk(chunk: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: this.config.model,
        messages: [
          { role: 'system', content: refineRawTranscriptPrompt },
          { role: 'user', content: chunk }
        ],
        temperature: this.config.temperature,
        max_tokens: this.config.maxTokens
      });
  
      const refinedText = completion.choices[0]?.message?.content;
      if (!refinedText) {
        throw new LLMProcessingError('No response received while refining a transcript chunk');
      }
  
      return refinedText;
    } catch (error) {
      console.error('Error processing transcript chunk:', error);
      throw new TranscriptParsingError(
        error instanceof Error ? error.message : 'Unknown error occurred during chunk processing'
      );
    }
  }
  
  

  async processRefinedTranscript(refinedTranscript: string): Promise<ProcessingResponse> {
    try {
      this.processingStages = [];
      this.updateStage('parsing', 'processing');
      console.log('Current NODE_ENV:', process.env.NODE_ENV);
  
      // Define a sequence of prompts and schemas
      const promptSchemaSequence = [
        { prompt: timelineViewPrompt, schema: timelineViewSchema },
        { prompt: quickViewPrompt, schema: quickViewSchema },
        // { prompt: topicViewPrompt, schema: topicViewSchema },
      ];
  
      // Initialize the final combined JSON object
      let combinedResponse: Record<string, any> = {};
  
      // Iterate through the sequence of API calls
      for (const { prompt, schema } of promptSchemaSequence) {
        console.log('Processing with prompt and schema:', prompt, schema.name);
  
        const completion = await this.openai.beta.chat.completions.parse({
          model: this.config.model,
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: refinedTranscript }
          ],
          temperature: this.config.temperature,
          max_tokens: this.config.maxTokens,
          response_format: { 
            type: "json_schema",
            json_schema: schema
          }
        });
  
        const response = completion.choices[0]?.message?.content;
        if (!response) {
          throw new LLMProcessingError(`No response from LLM for schema: ${schema.name}`);
        }
  
        const parsedResponse = JSON.parse(response);
  
        // Validate the response structure
        if (!this.validateResponse(parsedResponse)) {
          throw new LLMProcessingError(`Invalid response structure from LLM for schema: ${schema.name}`);
        }
  
        // Combine the current response into the final JSON object
        combinedResponse = { ...combinedResponse, ...parsedResponse };
      }
  
      // Save processed data in development mode
      if (process.env.NODE_ENV === 'development') {
        try {
          const outputPath = path.join(process.cwd(), 'data', 'processed', 'final-processed-combined.json');
          await mkdir(path.join(process.cwd(), 'data', 'processed'), { recursive: true });
          await writeFile(
            outputPath,
            JSON.stringify(combinedResponse, null, 2),
            'utf-8'
          );
          console.log('Combined processed data saved to:', outputPath);
        } catch (error) {
          console.error('Error saving processed data:', error);
        }
      }
  
      this.updateStage('parsing', 'completed');
  
      return {
        success: true,
        data: combinedResponse as MeetingData,
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