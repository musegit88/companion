import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";

export type CharacterKey = {
  characterName: string;
  modelName: string;
  userId: string;
};

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBclient: SupabaseClient;

  public constructor() {
    this.history = Redis.fromEnv();

    const auth = {
      detectSessionInUrl: false,
      persistSession: false,
      autoRefreshToken: false,
    };
    const url = process.env.SUPABASE_URL!;
    const privateKey = process.env.SUPABASE_PRIVATE_KEY!;
    this.vectorDBclient = createClient(url, privateKey, { auth });
  }

  public async vectorSearch(recentChatHistory: string, characterName: string) {
    const supabaseClient = <SupabaseClient>this.vectorDBclient;
    const vectorStore = await SupabaseVectorStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        client: supabaseClient,
        tableName: "documents",
        queryName: "match_documents",
        filter: { characterName },
      }
    );

    const similarDocs = await vectorStore
      .similaritySearch(recentChatHistory, 3)
      .catch((error) => {
        console.log("Failed to get vector search results", error);
      });
    return similarDocs;
  }
  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private generateRedisCharacterKey(characterKey: CharacterKey): string {
    return `${characterKey.characterName}-${characterKey.modelName}-${characterKey.userId}`;
  }

  public async writeToHistory(text: string, characterKey: CharacterKey) {
    if (!characterKey || typeof characterKey.userId == "undefined") {
      console.log("Character key set incorrectly");
      return "";
    }
    const key = this.generateRedisCharacterKey(characterKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
    return result;
  }

  public async readLatestHistory(characterKey: CharacterKey): Promise<string> {
    if (!characterKey || typeof characterKey.userId == "undefined") {
      console.log("Character key set incorrectly");
      return "";
    }
    const key = this.generateRedisCharacterKey(characterKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });
    result = result.slice(-30).reverse();
    const recentChats = result.reverse().join("\n");
    return recentChats;
  }

  public async seedChatHistory(
    seedContent: String,
    delimiter: string = "\n",
    characterKey: CharacterKey
  ) {
    const key = this.generateRedisCharacterKey(characterKey);
    if (await this.history.exists(key)) {
      console.log("User already has chat history");
      return;
    }
    const content = seedContent.split(delimiter);
    let counter = 0;

    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
