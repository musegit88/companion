import { groq } from "@/lib/groq";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const text = await req.text();
  try {
    const response = await groq.audio.speech.create({
      model: "playai-tts",
      voice: "Basil-PlayAI",
      input: text,
      response_format: "wav",
    });
    if (response.ok) {
      const buffer = Buffer.from(await response.arrayBuffer());
      return new NextResponse(buffer);
    }
  } catch (error) {
    console.log("TTS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
