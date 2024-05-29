"use server";

import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

export const addToSupabase = async (backgroundstory: string, name: string) => {
  try {
    const auth = {
      detectSessionUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    };

    const client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PRIVATE_KEY!,
      { auth }
    );

    await SupabaseVectorStore.fromTexts(
      [backgroundstory],
      { characterName: name },
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        client,
        tableName: "documents",
      }
    );
  } catch (error) {
    console.log("ADD_TO_SUPABASE", error);
  }
};
