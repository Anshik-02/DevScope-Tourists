import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  console.log("[SUPABASE/ID] Hydrating specific graph session");
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // Fetch full graph state for this user (Direct SDK)
    const { data, error } = await supabase
      .from("graphs")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId) // Security: Ensure ownership
      .single();

    if (error || !data) {
      console.error("[SUPABASE/ID] Hydration Error:", error);
      return new NextResponse("Session not found", { status: 404 });
    }

    // Remap response to match the frontend expected format (repoName instead of repo_name)
    const formattedData = {
      ...data,
      repoName: data.repo_name,
      createdAt: data.created_at
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[SUPABASE/ID] Internal Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
