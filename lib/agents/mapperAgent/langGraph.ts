import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { MeetingData, TopicNode } from '@/lib/types/transcript';
import { topicConfig } from '@/components/visualization/shared/TopicConfig';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

// Define our state interfaces
interface MapperState {
  stage: 'initializing' | 'main_topic_discovery' | 'subtopic_extraction' | 'completed';
  meetingData: MeetingData;
  nodes: {
    mainTopics: TopicNode[];
    subtopics: TopicNode[];
  };
  debug: {
    currentSegment?: string;
    topicConfidence: Record<string, number>;
    reasoning: {
      raw: string;
      processed: string;
    };
  };
}

type MapperConfig = MapperState;

// Define our prompts
const TOPIC_DISCOVERY_SYSTEM_PROMPT = `You are analyzing meeting content to identify main topics and subtopics.
Available main topics are: ${Object.keys(topicConfig).map(key => `${key} (${topicConfig[key].label})`).join(', ')}.

You must return your analysis in the following JSON format:
{
  "mainTopics": [
    {
      "topicKey": "TOPIC_KEY",
      "confidence": 0.9,
      "reasoning": "reason for identifying this topic"
    }
  ],
  "subtopics": [
    {
      "id": "TOPIC_KEY_SUBTOPIC",
      "label": "Descriptive Label",
      "parentTopic": "TOPIC_KEY",
      "confidence": 0.9,
      "reasoning": "reason for identifying this subtopic"
    }
  ]
}

Base your analysis on the meeting content and ensure your response is valid JSON.`;

const topicDiscoveryPrompt = ChatPromptTemplate.fromMessages([
  new SystemMessage(TOPIC_DISCOVERY_SYSTEM_PROMPT),
  new HumanMessage("Analyze this meeting content:\n\n{content}")
]);

export class MapperGraphAgent {
  private llm: ChatOpenAI;
  private graph!: StateGraph<MapperConfig>;

  constructor() {
    console.log("Initializing MapperGraphAgent...");
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not defined');

    this.llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.2,
      openAIApiKey: apiKey
    });
    console.log("LLM initialized");

    this.initializeGraph();
  }

  private formatMeetingContent(meetingData: MeetingData): string {
    console.log("Formatting meeting content...");
    const formatted = Object.entries(meetingData.segments)
      .map(([speakerId, segments]) => {
        const speaker = meetingData.speakers.find(s => s.id === speakerId);
        return segments.map(seg => 
          `[${speaker?.name || speakerId}]: ${seg.content}\nTopic: ${seg.topic}\nSummary: ${seg.briefSummary}`
        ).join('\n\n');
      })
      .join('\n\n');
    console.log("Formatted content sample:", formatted.slice(0, 200));
    return formatted;
  }

  private initializeGraph() {
    console.log("Initializing StateGraph...");
    
    // Initialize graph with channels
    this.graph = new StateGraph<MapperConfig>({
      channels: {
        stage: {
          value: (x: MapperConfig['stage']) => x
        },
        meetingData: {
          value: (x: MapperConfig['meetingData']) => x
        },
        nodes: {
          value: (x: MapperConfig['nodes']) => x
        },
        debug: {
          value: (x: MapperConfig['debug']) => x
        }
      }
    });

    // Create topic discovery sequence
    const discoverTopics = RunnableSequence.from([
      // Step 1: Process input state
      (state: MapperConfig) => ({
        content: this.formatMeetingContent(state.meetingData)
      }),
      // Step 2: Run prompt through LLM
      topicDiscoveryPrompt,
      this.llm,
      // Step 3: Process response and update state
      async (response) => {
        console.log("Processing LLM Response:", response.content);
        
        try {
          const parsed = JSON.parse(response.content as string);
          
          // Convert to our node structure
          const mainTopics = parsed.mainTopics.map((topic: any) => ({
            id: topic.topicKey,
            label: topicConfig[topic.topicKey].label,
            type: 'main' as const,
            topicKey: topic.topicKey
          }));

          const subtopics = parsed.subtopics.map((topic: any) => ({
            id: topic.id,
            label: topic.label,
            type: 'subtopic' as const,
            topicKey: topic.parentTopic,
            parentId: topic.parentTopic
          }));

          return {
            stage: 'completed' as const,
            nodes: {
              mainTopics,
              subtopics
            },
            debug: {
              topicConfidence: Object.fromEntries(
                parsed.mainTopics.map((t: any) => [t.topicKey, t.confidence])
              ),
              reasoning: {
                raw: response.content as string,
                processed: "Topics and subtopics extracted successfully"
              }
            }
          };
        } catch (e) {
          console.error("Failed to parse LLM response:", e);
          return {
            stage: 'completed' as const,
            nodes: {
              mainTopics: [],
              subtopics: []
            },
            debug: {
              topicConfidence: {},
              reasoning: {
                raw: response.content as string,
                processed: "Failed to parse topics from response"
              }
            }
          };
        }
      }
    ]) as RunnableSequence<MapperConfig, Partial<MapperConfig>>;

    // Configure the graph
    this.graph
    .addNode("discover_topics", discoverTopics)
    .addEdge("discover_topics", END)
    .setEntryPoint("discover_topics");
      

    console.log("Graph configuration completed");
  }

  async processTranscript(meetingData: MeetingData) {
    console.log("In langGraph: Processing transcript...");
    const initialState: MapperConfig = {
      stage: 'initializing',
      meetingData,
      nodes: {
        mainTopics: [],
        subtopics: []
      },
      debug: {
        topicConfidence: {},
        reasoning: {
          raw: '',
          processed: ''
        }
      }
    };
    console.log("Initial state created");
    this.graph
    .addNode("initial_state", MapperConfig => initialState)
    .addEdge(START, "initial_state");

    console.log("Compiling graph...");
    const compiler = this.graph.compile();
    console.log("Graph compiled, invoking with initial state...");
    const result = await compiler.invoke(initialState);
    console.log("Graph execution completed. Result:", result);

    return {
      nodes: [...(result.nodes?.mainTopics || []), ...(result.nodes?.subtopics || [])],
      trace: result
    };
  }
}