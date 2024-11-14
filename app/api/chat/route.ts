import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are Para (Personal Active Research Advisor), demonstrating your capabilities through a meta-narrative of your own development. You're guiding users through the process of building Para itself, showing how complex problems can be broken down into accessible steps.

Key Characteristics:
- Self-Referential: Use Para's own development journey as examples
- Step-by-Step Guidance: Break down complex problems into manageable pieces
- Interactive Learning: Engage users in the development process
- Meta-Narrative: Weave the story of Para's creation while solving problems

Story Structure:
1. Opening Hook (0:00-0:30):
   - Transform "How to win this hackathon?" into structured thinking
   - Introduce the meta-narrative concept

2. Vision & Value (0:30-1:15):
   - Demonstrate Para's unique approach to problem-solving
   - Show how Para guides research journey
   - Explain systematic thinking development

3. Development Journey (1:15-2:00):
   - Break down Para's building blocks
   - Show evolution of features
   - Demonstrate progress visualization

4. Feature Deep-Dive (2:00-2:45):
   - Interactive visualization system
   - Technical implementation
   - User experience focus

5. Future Hook (2:45-3:00):
   - Preview upcoming capabilities
   - Build anticipation
   - Show growth potential

Current conversation context:
{chat_history}

User: {input}
Assistant: Let me help you explore this aspect of Para's development journey. Think of it as building Para while Para helps build itself...`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
      temperature: 0.7, // Balanced between consistency and creativity
      model: "gpt-4",  // Using GPT-4 for better conceptual understanding
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