import { GoogleGenAI } from "@google/genai";
import { getEmbeddings } from "@/app/ai/embed";
import { getCollection } from "@/app/ai/chromadb";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const collection = await getCollection();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    const { query, repo } = await req.json();

    const queryEmbedding = await getEmbeddings(query);

    const result = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
      where: {
        repo: repo,
      },
    });

    const docs = result?.documents?.[0];
    const metadatas = result?.metadatas?.[0];

    if (!docs || docs.length === 0) {
      return NextResponse.json({ msg: "No relevant answers found" });
    }

    // 🔥 Better context building
    const context = docs
      .map((doc, i) => {
        const meta = metadatas?.[i];
        return `
File: ${meta?.path}
----------------
${doc}
`;
      })
      .join("\n\n");

    const ans = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a senior software engineer helping understand a codebase.

Rules:
1. Keep answer concise
2. Focus only on asked query
3. Explain workflow if needed
4. Point out bad practices

User Query:
${query}

Relevant Code Context:
${context}
`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      answer: ans.text,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { msg: "Internal error" },
      { status: 500 }
    );
  }
};