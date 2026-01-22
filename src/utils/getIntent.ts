import { GenerativeModel } from "@google/generative-ai";
export async function getIntent(
  model: GenerativeModel,
  userPrompt: string,
  searchQuery: string,
): Promise<"YES" | "NO"> {
  const classifierPrompt = `
  You are an intent compatibility classifier.

  User focus:
  "${userPrompt}"

  Search query:
  "${searchQuery}"

  Question:
  Is the search query relevant to or a valid refinement, expansion, or subset of the user's focus?

  Rules:
  - Answer YES if the search query helps satisfy the user's focus, even if it is more specific or more general
  - Answer NO only if the search query is unrelated or off-topic
  - Answer ONLY with YES or NO
  - Do not explain
  `.trim();

  const result = await model.generateContent({
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
  });

  const rawText =
    result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

  const answer = rawText.trim().replace(".", "").toUpperCase();

  return answer === "YES" ? "YES" : "NO";
}
