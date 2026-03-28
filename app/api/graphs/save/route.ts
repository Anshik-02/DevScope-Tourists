import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  console.log("[SUPABASE/SAVE] Received request");
  try {
    const { userId } = await auth();
    console.log("[SUPABASE/SAVE] Auth Check:", userId || "UNAUTHORIZED");
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { repoName, nodes, edges } = body;

    if (!repoName || !nodes || !edges) {
      console.warn("[SUPABASE/SAVE] Missing data:", { repoName, hasNodes: !!nodes });
      return new NextResponse("Missing data", { status: 400 });
    }

    // 1. Ensure User Profile exists (Direct SDK)
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: userId }, { onConflict: "id" });

      if (profileError) {
        console.warn("[SUPABASE/SAVE] Profile Sync Hint (Non-fatal if no FK):", profileError.message);
        // We continue if it's not a catastrophic error, as the 'graphs' table might not have a strict FK
      }
    } catch (e) {
      console.warn("[SUPABASE/SAVE] Profile Upsert Exception:", e);
    }

    // 2. Save Graph Snapshot
    const { data, error: graphError } = await supabase
      .from("graphs")
      .insert({
        repo_name: repoName,
        nodes,
        edges,
        user_id: userId
      })
      .select()
      .single();

    if (graphError) {
      console.error("[SUPABASE/SAVE] Graph Persistence Error:", graphError);
      return new NextResponse(`Persistence Error: ${graphError.message}`, { status: 500 });
    }

    console.log("[SUPABASE/SAVE] Snapshot live in Supabase:", data.id);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[SUPABASE/SAVE] Internal Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
