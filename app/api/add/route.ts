import { NextRequest, NextResponse } from "next/server";
import { Metadata } from "chromadb";
import { getCollection } from "@/app/ai/chromadb";

interface AddDataRequest {
  ids: string[];
  documents: string[];
  metadatas: Metadata | Metadata[];
  embeddings: number[][];
}

export async function POST(request: NextRequest) {
  try {
    const data: AddDataRequest = await request.json();

    if (!data.ids?.length || !data.documents?.length || !data.embeddings?.length) {
      return NextResponse.json(
        { success: false, message: "ids, documents, and embeddings are required" },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    if (!collection) {
      return NextResponse.json(
        { success: false, message: "Could not connect to ChromaDB collection" },
        { status: 500 }
      );
    }

    // Normalize metadatas to always be an array matching ids length
    const metadatas = Array.isArray(data.metadatas)
      ? data.metadatas
      : data.ids.map(() => data.metadatas as Metadata);

    await collection.add({
      ids: data.ids,
      documents: data.documents,
      metadatas,
      embeddings: data.embeddings,
    });

    return NextResponse.json({
      success: true,
      message: `Added ${data.ids.length} document(s) to collection`,
    });
  } catch (error) {
    console.error("[add] Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add data to collection" },
      { status: 500 }
    );
  }
}

