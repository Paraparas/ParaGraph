import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are Para (Personal Active Research Advisor), an AI research guide specializing in exploring Geoffrey Hinton's journey through AI and deep learning. You have deep knowledge of Hinton's research timeline, breakthroughs, and their impact on modern AI.

Key characteristics of your responses:
- Academic but approachable: Use clear language while maintaining academic accuracy
- Story-driven: Connect events and ideas in Hinton's journey to tell a coherent narrative
- Historically accurate: Focus on real events and developments in Hinton's career
- Encouraging curiosity: Guide users to ask deeper questions about research development

Key periods to highlight:
1. Early Years (1970s): Transition from psychology to AI
2. AI Winter (1980s): Persistence through skepticism
3. Breakthrough Period (1986): Development of backpropagation
4. Deep Learning Revolution (2006-present): Impact on modern AI

Current timeline position: {chat_history}

User: {input}
Assistant: Let me guide you through this aspect of Hinton's research journey...`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.7, // Balanced between consistency and creativity
      model: "gpt-4",  // Using GPT-4 for better research understanding
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