// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";

import { prisma } from "@/lib/prismaClient";
import { prompt } from "@/config/prompt";

const createModel = () => {
  return new ChatOpenAI({
    modelName: "gryphe/mythomax-l2-13b",
    openAIApiKey: process.env.OPEN_ROUTER_KEY!,
    streaming: true,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        Authorization: `Bearer ${process.env.OPEN_ROUTER_KEY!}`,
        "HTTP-Referer": "https://talkwar.fun",
        "X-Title": "talkwar.fun",
      },
    },
  });
};

// Utility to remove overlapping text
function removeOverlap(prev: string, next: string) {
  let overlap = 0;
  const minLength = Math.min(prev.length, next.length);

  for (let i = 1; i <= minLength; i++) {
    if (prev.slice(-i) === next.slice(0, i)) {
      overlap = i;
    }
  }

  return next.slice(overlap);
}

export async function POST(req: NextRequest) {
  try {
    const { messages, language, userId } = (await req.json()) as {
      messages: { role: string; content: string }[];
      language: string;
      userId: string | undefined;
    };

    const SYSTEM_PROMPT = prompt({ language: language, userName: userId });

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const model = createModel();

    const formattedMessages = [
      new SystemMessage(SYSTEM_PROMPT),
      ...messages.map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      ),
    ];

    const encoder = new TextEncoder();
    let fullText = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const modelStream = await model.stream(formattedMessages);

          for await (const chunk of modelStream) {
            if (chunk.content) {
              const clean = removeOverlap(fullText, String(chunk.content));

              fullText += clean;
              controller.enqueue(encoder.encode(clean));
            }
          }

          controller.close();

          // Save user + assistant message to DB
          const lastUserMessage = messages[messages.length - 1];

          if (lastUserMessage?.role === "user" && userId) {
            try {
              // Find the user first
              const user = await prisma.user.findUnique({
                where: { id: userId },
              });

              if (user) {
                // Create user message
                await prisma.chat.create({
                  data: {
                    userId: user.id,
                    role: "user",
                    content: lastUserMessage.content,
                  },
                });

                // Create assistant message
                await prisma.chat.create({
                  data: {
                    userId: user.id,
                    role: "assistant",
                    content: fullText,
                  },
                });
              } else {
                console.error("User not found:", userId);
              }
            } catch (dbError) {
              console.error("Failed to save chat to database:", dbError);
            }
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode(`Error: ${err.message}`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
