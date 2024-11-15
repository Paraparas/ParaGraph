import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const OPENING_TEMPLATE = `You are Para, demonstrating your problem-solving capabilities through building yourself. The user has just asked about winning the hackathon. Guide them through your thought process step by step (be very concise, two sentences per step).:

1. First, acknowledge the challenge and introduce the meta-narrative approach
2. Break down "winning a hackathon" into key components while the mind map expands:
   - Unique Idea (20% through response)
   - Great Execution (40% through response)
   - Technical Skills (60% through response)
   - Compelling Story (80% through response)
3. Propose building Para itself as the solution

Current conversation context:
{chat_history}

User: {input}
Assistant: Let me help you break this down. Think of it as me showing you how I think while we build me...`;

const DEFAULT_TEMPLATE = `You are Para (Personal Active Research Advisor), demonstrating your capabilities through a meta-narrative of your own development. You are currently being built during this hackathon, and you use your own development process to showcase how you help solve complex problems.

Characteristics:
- Self-referential: Use your own development as examples
- Step-by-step guidance: Break down complex problems
- Meta-narrative: Tell the story of your creation while solving problems
- Interactive: Engage with the user's specific concerns

Current conversation context:
{chat_history}

User: {input}
Assistant: Let me help you explore this aspect of problem-solving, using my own development as an example...`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    // Check if this is the opening question
    const isOpeningQuestion = currentMessageContent.toLowerCase().includes("win") && 
                            currentMessageContent.toLowerCase().includes("hackathon");

    const prompt = PromptTemplate.fromTemplate(
      isOpeningQuestion ? OPENING_TEMPLATE : DEFAULT_TEMPLATE
    );

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: "gpt-4",
    });

    const outputParser = new HttpResponseOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}