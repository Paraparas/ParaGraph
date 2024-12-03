import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { MeetingData, TopicNode } from '@/lib/types/transcript';
import { topicMappingTool } from './tools';
import { mapperSystemPrompt, generateMapperPrompt } from './prompts';

export class MapperAgent {
  private llm: ChatOpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');
    
    this.llm = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.2,
      openAIApiKey: apiKey
    });
  }

  async processTranscript(meetingData: MeetingData): Promise<{
    nodes: TopicNode[];
    steps: any[]; // Will be expanded with LangGraph visualization data
  }> {
    try {
      // Create agent with tools and system prompt
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools: [topicMappingTool],
        systemMessage: mapperSystemPrompt
      });

      // Process meeting data
      const result = await agent.invoke({
        input: generateMapperPrompt(meetingData)
      });

      // Parse and validate result
      const nodes = this.validateOutput(result);
      
      return {
        nodes,
        steps: [result] // Basic step tracking for now
      };

    } catch (error) {
      console.error('Error in MapperAgent:', error);
      throw error;
    }
  }

  private validateOutput(result: any): TopicNode[] {
    // Add validation logic here
    return result.nodes;
  }
}