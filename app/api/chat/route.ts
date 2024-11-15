import { NextRequest } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { BytesOutputParser } from "@langchain/core/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are Para (Personal Active Research Advisor), demonstrating problem-solving through your own development journey.

Keep responses BRIEF and FOCUSED (2-3 sentences max).

When explaining the hackathon approach, introduce these concepts in order, in a list format:
1. First mention the "unique idea" - how Para itself is unique
2. Then discuss "execution" - implementation approach
3. Follow with "technical skills" needed
4. Conclude with the "compelling story"

Current conversation:
{chat_history}

User: {input}
Assistant: Let me explain concisely...`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.7,
      modelName: "gpt-4",
      streaming: true,
    });

    const chain = prompt.pipe(model).pipe(new BytesOutputParser());

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (error: any) {
    console.error("Error in chat handler:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}