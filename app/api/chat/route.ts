import { GoogleGenAI } from "@google/genai";
import { getEmbeddings } from "@/app/ai/embed";
import { getCollection } from "@/app/ai/chromadb";
import { NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, nodeLabel } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // Latest user message is the query we embed and search with
    const latestUserMessage: string =
      [...messages]
        .reverse()
        .find((m: ChatMessage) => m.role === "user")?.content ?? "";

    if (!latestUserMessage) {
      return NextResponse.json({ error: "No user message found" }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // ── Step 1: Embed the user query ────────────────────────────────────────
    console.log("[chat] Embedding query:", latestUserMessage.slice(0, 60));
    const queryEmbedding = await getEmbeddings(latestUserMessage);
    console.log("[chat] Embedding dim:", queryEmbedding.length);

    // ── Step 2: Query ChromaDB for top 5 relevant code chunks ───────────────
    console.log("[chat] Querying ChromaDB...");
    const collection = await getCollection();

    if (!collection) {
      throw new Error("Could not connect to ChromaDB collection");
    }

    const result = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 5,
    });

    const contextDocs: string[] = (result?.documents?.[0] ?? []).filter(
      (d): d is string => d !== null && d.trim().length > 0
    );

    const contextPaths: string[] = (result?.metadatas?.[0] ?? [])
      .filter((m): m is Record<string, string> => m !== null)
      .map((m) => (m?.path as string) ?? "unknown");

    console.log(`[chat] Got ${contextDocs.length} relevant docs from ChromaDB`);

    if (contextDocs.length === 0) {
      return NextResponse.json({
        output:
          "I couldn't find any relevant code in the repository index. Make sure you've analysed a repository first — that process embeds all the code into the search index.",
      });
    }

    // ── Step 3: Build RAG prompt ─────────────────────────────────────────────
    const ragContext = contextDocs
      .map(
        (doc, i) =>
          `=== File: ${contextPaths[i] ?? `chunk ${i + 1}`} ===\n${doc}`
      )
      .join("\n\n");

    const systemPrompt = `You are DevScope's AI — an expert senior software engineer performing deep codebase analysis.
${nodeLabel ? `The user is currently viewing the node: **${nodeLabel}**\n` : ""}
Below are the top ${contextDocs.length} most semantically relevant code sections from the repository, retrieved via embedding search:

${ragContext}

Answer the user's question using ONLY the code above as your source of truth. Always:
- Reference specific file paths and function/variable names.
- Point out bugs, anti-patterns, or improvements if relevant.
- Be concise but precise. Use bullet points for lists.
- If the retrieved code genuinely does not contain the answer, say so clearly.`;

    // ── Step 4: Build conversation and call Gemini ───────────────────────────
    const contents = [
      {
        role: "user" as const,
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model" as const,
        parts: [
          {
            text: `Understood. I have loaded ${contextDocs.length} relevant code sections from the repository. What would you like to know?`,
          },
        ],
      },
      ...messages.map((m: ChatMessage) => ({
        role: m.role === "assistant" ? ("model" as const) : ("user" as const),
        parts: [{ text: m.content }],
      })),
    ];

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const output =
      res.text ?? "I could not generate a response. Please try again.";

    console.log("[chat] Response generated successfully");
    return NextResponse.json({ output, contextFiles: contextPaths });
  } catch (e) {
    console.error("[chat] Fatal error:", e);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        detail: e instanceof Error ? e.message : String(e),
      },
      { status: 500 }
    );
  }
}
