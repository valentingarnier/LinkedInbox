import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Import } from "@/lib/supabase/types";

/**
 * POST /api/import
 * Creates an import record (tracking purposes)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileName, totalMessages, totalConversations } = body;

    const { data: importRecordData, error } = await db
      .from("imports")
      .insert({
        user_id: user.id,
        file_name: fileName,
        total_messages: totalMessages,
        total_conversations: totalConversations,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    const importRecord = importRecordData as Import | null;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(importRecord);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create import record" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/import
 * Returns import history for the user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: importsData, error } = await db
      .from("imports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const imports = importsData as Import[] | null;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(imports);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch imports" },
      { status: 500 }
    );
  }
}
