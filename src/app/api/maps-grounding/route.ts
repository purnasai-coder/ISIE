import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, latitude, longitude } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (typeof latitude === "number" && typeof longitude === "number") {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude,
            longitude,
          },
        },
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: query,
      config,
    });

    const text = response.text || "";
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return NextResponse.json({
      text,
      groundingChunks,
    });
  } catch (error: any) {
    console.error("Maps grounding API error:", error);
    let message = error?.message || "Failed to process Maps Grounding request.";
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
