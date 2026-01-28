import { redirect } from "next/navigation";
import { createClient, fetchAllRows } from "@/lib/supabase/server";
import { DashboardContent } from "./dashboard-content";
import type { Profile, Conversation, AnalyticsSummary, Database } from "@/lib/supabase/types";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

// Disable caching for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get or create user profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let profile = profileData as Profile | null;

  if (!profile) {
    const newProfile: ProfileInsert = {
      id: user.id,
      first_name: null,
      last_name: null,
      avatar_url: user.user_metadata?.avatar_url || null,
    };
    // Type assertion needed due to Supabase SSR client generic limitations
    const { data: newProfileData } = await (supabase.from("profiles") as any)
      .insert(newProfile)
      .select()
      .single();

    profile = newProfileData as Profile | null;
  }

  // Fetch ALL conversations using pagination helper
  const conversations = await fetchAllRows<Conversation>(supabase, "conversations", {
    eq: { user_id: user.id },
    order: { column: "last_message_date", ascending: false },
  });

  // Get analytics summary
  const { data: analyticsData } = await supabase
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
