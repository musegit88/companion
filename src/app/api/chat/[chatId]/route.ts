import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import { Replicate } from "@langchain/community/llms/replicate";
import { StreamingTextResponse, LangChainStream } from "ai";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rate-limit";
import db from "@/lib/prismaDb";

export async function POST(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await req.json();
    const user = await currentUser();
    if (!user || !user.firstName || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Implement ratelimit
    const identifier = req.url + "-" + user.id;
    const { success } = await rateLimit(identifier);
    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }

    // Add the prompt to database
    const character = await db.character.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            role: "user",
            userId: user.id,
          },
        },
      },
    });

    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    const characterName = character.name;

    const characterKey = {
      characterName,
      userId: user.id,
      modelName: "meta/llama-2-7b-chat-int8",
    };

    const memoryManager = await MemoryManager.getInstance();

    const records = await memoryManager.readLatestHistory(characterKey);
    if (records.length === 0) {
      await memoryManager.seedChatHistory(character.seed, "\n\n", characterKey);
    }

    await memoryManager.writeToHistory("User:" + prompt + "\n", characterKey);

    let recentChatHistory = await memoryManager.readLatestHistory(characterKey);

    const similarDocs = await memoryManager.vectorSearch(
      recentChatHistory,
      characterName
    );

    let relevantHistory = "";

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const run = async (model: string, input: any) => {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/${model}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.WORKERS_AI_API_TOKEN}`,
          },
          method: "POST",
          body: JSON.stringify(input),
        }
      );
      const result = await response.json();
      return result;
    };

    const result = await run("@cf/meta/llama-2-7b-chat-int8", {
      messages: [
        {
          role: "system",
          content: String(
            `
                   ONLY generate NO more than four sentences as ${characterName}. DO NOT generate more than four sentences.
                Make sure the output you generate starts with '${characterName}:' and ends with a period.
        
                ${character.instructions}
        
                Below are relevant details about ${characterName}'s past and the conversation you are in.
                ${relevantHistory}
                   `
          ),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const resp = result.result.response;
    const structured = resp.replaceAll(",", "");
    const chunks = structured.split("\n");
    const response = chunks[0];

    await memoryManager.writeToHistory("" + response.trim(), characterKey);
    var Readable = require("stream").Readable;

    let s = new Readable();
    s.push(response);
    s.push(null);

    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), characterKey);
      await db.character.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }

    return new StreamingTextResponse(s);
  } catch (error) {
    console.log("CHAT_POST", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
