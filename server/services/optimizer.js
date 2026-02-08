import Groq from "groq-sdk";
import { getEncoding } from "js-tiktoken";
import dotenv from "dotenv";

dotenv.config();

// 1. Initialize Token Counter
const encoding = getEncoding("cl100k_base");
export const countTokens = (text) => encoding.encode(text).length;

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function optimizeAndCompare(rawText) {
  // We combine the system instructions and user input into ONE 'user' message
  // to avoid the "Only user and assistant roles are supported" error.
  const promptForMistral = `
SYSTEM INSTRUCTION:
You are an expert Prompt Engineer. Rewrite the following user input to be extremely token-efficient. 
Remove all politeness, introductory fluff, and conversational filler. 
Use imperative commands. Keep all technical constraints. 
Output ONLY the refined prompt.

USER INPUT TO REWRITE:
"${rawText}"
  `.trim();

  const originalTokenCount = countTokens(rawText);

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: promptForMistral }],
      temperature: 0.1,
    });

    const optimizedText = completion.choices[0].message.content.trim();
    const optimizedTokenCount = countTokens(optimizedText);
    const saved = originalTokenCount - optimizedTokenCount;

    return {
      original: originalTokenCount,
      optimized: optimizedTokenCount,
      saved: saved,
      percent: ((saved / originalTokenCount) * 100).toFixed(1),
      result: optimizedText,
    };
  } catch (error) {
    console.error("Groq Optimization Error:", error.message);
    throw error; // Re-throw to be handled by the route
  }
}
