import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const text = await req.text();
  const openai_headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  try {
    const response = await fetch(`https://api.openai.com/v1/audio/speech`, {
      method: "POST",
      body: JSON.stringify({
        model: "tts-1",
        voice: "alloy",
        input: text,
        response_format: "mp3",
      }),
      headers: openai_headers,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    return new NextResponse(buffer);
  } catch (error) {
    console.log("TTS_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
