import { GoogleGenAI } from "@google/genai";

export async function getEmbeddings(text: string) {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_EMBED_API_KEY!
        });
        const res = await ai.models.embedContent({
            model: "text-embedding-004",
            contents: text
        });
        const embedding = res.embeddings?.[0]?.values;
        if (!embedding) {
            throw new Error("Embedding not found");
        }
        return embedding;
    }
    catch (e) {
        console.error(e);
        return [111]; // Fallback value
    }
}