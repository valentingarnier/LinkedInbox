import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalysisStatus } from "@/lib/supabase/types";

interface ConversationStatus {
  id: string;
  analysis_status: AnalysisStatus;
}

/**
 * GET /api/analyze/status
 * Returns analysis status counts for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: conversationsData, error: convError } = await db
      .from("conversations")
      .select("id, analysis_status")
      .eq("user_id", user.id);

    if (convError) {
      return NextResponse.json({ error: "DB error", details: convError.message }, { status: 500 });
    }

    const conversations = conversationsData as ConversationStatus[] | null;

    if (!conversations?.length) {
      return NextResponse.json({
        total: 0,
        pending: 0,
        analyzing: 0,
        completed: 0,
        failed: 0,
        isComplete: true,
      });
    }

    const statusCounts = {
      pending: 0,
      analyzing: 0,
      completed: 0,
      failed: 0,
    };

    conversations.forEach((c) => {
      const status = c.analysis_status as keyof typeof statusCounts;
      if (status in statusCounts) {
        statusCounts[status]++;
      }
    });

    return NextResponse.json({
      total: conversations.length,
      ...statusCounts,
      isComplete: statusCounts.pending === 0 && statusCounts.analyzing === 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get analysis status", details: String(error) },
      { status: 500 }
    );
  }
}
