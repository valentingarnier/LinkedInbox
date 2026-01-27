import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";
import type { Profile, Conversation, AnalyticsSummary } from "@/lib/supabase/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const db = supabase as any;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get or create user profile
  let { data: profileData } = await db
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let profile = profileData as Profile | null;

  if (!profile) {
    const { data: newProfileData } = await db
      .from("profiles")
      .insert({
        id: user.id,
        first_name: null,
        last_name: null,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .select()
      .single();

    profile = newProfileData as Profile | null;
  }

  // Get user's conversations
  const { data: conversationsData } = await db
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("last_message_date", { ascending: false });

  const conversations = (conversationsData as Conversation[] | null) || [];

  // Get analytics summary
  const { data: analyticsData } = await db
    .from("analytics_summary")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const analytics = analyticsData as AnalyticsSummary | null;

  return (
    <DashboardContent
      user={{
        id: user.id,
        email: user.email || "",
        firstName: profile?.first_name || "",
        lastName: profile?.last_name || "",
        avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || "",
      }}
      conversations={conversations}
      analytics={analytics}
    />
  );
}
