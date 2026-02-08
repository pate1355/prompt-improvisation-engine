import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();    

// Initialize Groq Client
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function executeGroqPrompt(model, prompt) {
    try {
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "user", content: prompt }
            ],
            // Add max_tokens if needed, but keeping it simple for now
        });

        return {
            output_text: response.choices[0]?.message?.content || "",
            raw: response
        };
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}
