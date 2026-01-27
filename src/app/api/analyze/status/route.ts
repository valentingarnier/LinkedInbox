import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AnalysisStatus, AnalyticsSummary } from "@/lib/supabase/types";

interface ConversationStatus {
  id: string;
  analysis_status: AnalysisStatus;
}

const STAGE_LABELS: Record<string, string> = {
  preparing: "Preparing conversations...",
  computing_metrics: "Computing engagement metrics...",
  classifying_outreach: "Identifying cold outreach conversations...",
  analyzing_prospects: "Analyzing prospect status & outreach quality...",
  computing_global: "Computing global analytics...",
  complete: "Analysis complete",
};

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

    // Get conversation counts
    const { data: conversationsData, error: convError } = await db
      .from("conversations")
      .select("id, analysis_status")
      .eq("user_id", user.id);

    if (convError) {
      return NextResponse.json({ error: "DB error", details: convError.message }, { status: 500 });
    }

    // Get analysis progress from analytics_summary
    const { data: analyticsData } = await db
      .from("analytics_summary")
      .select("analysis_stage, analysis_progress, analysis_total")
      .eq("user_id", user.id)
      .single();

    const analytics = analyticsData as Pick<AnalyticsSummary, "analysis_stage" | "analysis_progress" | "analysis_total"> | null;

    const conversations = conversationsData as ConversationStatus[] | null;

    if (!conversations?.length) {
      return NextResponse.json({
        total: 0,
        pending: 0,
        analyzing: 0,
        completed: 0,
        failed: 0,
        isComplete: true,
        stage: null,
        stageLabel: null,
        progress: null,
        progressTotal: null,
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

    const isComplete = statusCounts.pending === 0 && statusCounts.analyzing === 0;
    const stage = analytics?.analysis_stage || null;

    return NextResponse.json({
      total: conversations.length,
      ...statusCounts,
      isComplete,
      stage,
      stageLabel: stage ? STAGE_LABELS[stage] || stage : null,
      progress: analytics?.analysis_progress || null,
      progressTotal: analytics?.analysis_total || null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get analysis status", details: String(error) },
      { status: 500 }
    );
  }
}
