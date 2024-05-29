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
      modelName: "llama2-13b",
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
    console.log(similarDocs);
    let relevantHistory = "";

    if (!!similarDocs && similarDocs.length !== 0) {
      relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
    }

    const { stream, handlers } = LangChainStream();

    const model = new Replicate({
      model:
        "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",

      input: {
        max_length: 2048,
      },
      apiKey: process.env.REPLICATE_API_TOKEN,
      callbacks: CallbackManager.fromHandlers(handlers),
    });
    model.verbose = true; //for debugging

    const resp = String(
      await model
        .invoke(
          `
          ONLY generate NO more than four sentences as ${characterName}. DO NOT generate more than four sentences. 
       Make sure the output you generate starts with '${characterName}:' and ends with a period.

       ${character.instructions}

       Below are relevant details about ${characterName}'s past and the conversation you are in.
       ${relevantHistory}


       ${recentChatHistory}\n${characterName}:
          `
        )
        .catch(console.error)
    );

    const structured = resp.replaceAll(",", "");
    const chunks = structured.split("\n");
    // const response = chunks[0];
    const response = chunks.length > 1 ? chunks[chunks.length - 1] : chunks[0];

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
