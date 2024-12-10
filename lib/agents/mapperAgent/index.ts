import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { MeetingData, TopicNode } from '@/lib/types/transcript';
import { topicMappingTool } from './tools';
import { mapperSystemPrompt, generateMapperPrompt } from './prompts';
import { AgentStep } from "@langchain/core/agents";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

export class MapperAgent {
  private llm: ChatOpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');
    
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      openAIApiKey: apiKey
    });
    console.log('MapperAgent: LLM initialized');
  }

  async processTranscript(meetingData: MeetingData): Promise<{
    nodes: TopicNode[];
    steps: AgentStep[];
  }> {
    try {
      console.log('MapperAgent: Starting processing');

      // Create prompt template
      const prompt = ChatPromptTemplate.fromMessages([
        mapperSystemPrompt,
        ["human", "{input}"],
        ["assistant", "{agent_scratchpad}"]
      ]);
      console.log('MapperAgent: Prompt template created');

      // Log the generated prompt
      const generatedPrompt = generateMapperPrompt(meetingData);
      console.log('MapperAgent: Generated prompt:', generatedPrompt);

      // Create agent with tools and prompt
      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools: [topicMappingTool],
        prompt
      });
      console.log('MapperAgent: Agent created');

      // Create agent executor
      const agentExecutor = new AgentExecutor({
        agent,
        tools: [topicMappingTool],
        maxIterations: 10,
      });
      console.log('MapperAgent: Executor created');

      // Process meeting data
      console.log('MapperAgent: Invoking executor');
      const result = await agentExecutor.invoke({
        input: generatedPrompt
      });
      console.log('MapperAgent: Raw executor result:', result);

      // Parse and validate result
      const nodes = this.validateOutput(result);
      console.log('MapperAgent: Validated nodes:', nodes);
      
      return {
        nodes,
        steps: result.steps || []
      };

    } catch (error) {
      console.error('Error in MapperAgent:', error);
      throw error;
    }
  }

  private validateOutput(result: any): TopicNode[] {
    try {
      console.log('MapperAgent: Validating output:', result);
      const outputData = typeof result === 'string' ? JSON.parse(result) : result;
      console.log('MapperAgent: Parsed output data:', outputData);
      return Array.isArray(outputData.nodes) ? outputData.nodes : [];
    } catch (error) {
      console.error('Error validating output:', error);
      return [];
    }
  }
}