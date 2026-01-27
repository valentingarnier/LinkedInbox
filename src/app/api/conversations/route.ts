import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Conversation } from "@/lib/supabase/types";

/**
 * GET /api/conversations
 * Returns all conversations for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const db = supabase as any;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: conversationsData, error } = await db
      .from("conversations")
      .select("*")
      .eq("user_id", user.id)
      .order("last_message_date", { ascending: false });

    const conversations = conversationsData as Conversation[] | null;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
