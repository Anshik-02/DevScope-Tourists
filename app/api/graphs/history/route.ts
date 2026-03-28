import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  console.log("[SUPABASE/HISTORY] Fetching session history");
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch last 5 graphs for this user (Direct SDK)
    const { data, error } = await supabase
      .from("graphs")
      .select("id, repo_name, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("[SUPABASE/HISTORY] Error:", error);
      return new NextResponse("Persistence Error", { status: 500 });
    }

    // Remap response to match the frontend expected format (repoName instead of repo_name)
    const formattedData = data.map((item: any) => ({
      id: item.id,
      repoName: item.repo_name,
      createdAt: item.created_at
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("[SUPABASE/HISTORY] Internal Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
