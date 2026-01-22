import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // 🔒 Hardcoded for now
  const userPrompt = "coding videos";
  const searchQuery = "mern stack tutorials";

  const classifierPrompt = `
You are an intent alignment classifier.

User focus:
"${userPrompt}"

Search query:
"${searchQuery}"

Question:
Does the search query align with the user's focus?

Rules:
- Answer ONLY with YES or NO
- Do not explain
`.trim();

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: classifierPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 5,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const answer = rawText.trim().replace(".", "").toUpperCase();

    return NextResponse.json({
      success: true,
      result: answer, // YES or NO
    });
  } catch (error: any) {
    console.error("Gemini intent check failed:", error?.response?.data || error);

    return NextResponse.json(
      {
        success: false,
        error: "Intent check failed",
      },
      { status: 500 }
    );
  }
}
