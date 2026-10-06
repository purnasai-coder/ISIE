import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

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

    // Grounding with Google Search using gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];
    const searchEntryPoint = groundingMetadata?.searchEntryPoint?.renderedContent || null;

    return NextResponse.json({
      text,
      groundingChunks,
      webSearchQueries,
      searchEntryPoint,
    });
  } catch (error: any) {
    console.error("Search grounding API error:", error);
    let message = error?.message || "Failed to process Google Search Grounding request.";
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
