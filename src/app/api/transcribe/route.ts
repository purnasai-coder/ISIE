import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { audioBase64, mimeType = "audio/webm", prompt } = await req.json();

    if (!audioBase64) {
      return NextResponse.json({ error: "audioBase64 is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Clean base64 if data URI prefix was sent
    const cleanBase64 = audioBase64.includes(",")
      ? audioBase64.split(",")[1]
      : audioBase64;

    const audioPart = {
      inlineData: {
        mimeType: mimeType || "audio/webm",
        data: cleanBase64,
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-transcribe",
      contents: {
        parts: [
          audioPart,
          { text: prompt || "Transcribe this tactical audio recording accurately, preserving technical terms, tactical codes, and location names." },
        ],
      },
    });

    const text = response.text || "";

    return NextResponse.json({
      text,
    });
  } catch (error: any) {
    console.error("Audio transcription API error:", error);
    let message = error?.message || "Failed to transcribe audio.";
    try {
      if (typeof message === "string" && message.startsWith("{")) {
        const parsed = JSON.parse(message);
        if (parsed?.error?.message) {
          message = parsed.error.message;
        }
      }
    } catch (_) {}
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
