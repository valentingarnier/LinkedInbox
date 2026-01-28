"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAnalysis, useConversations } from "@/hooks";
import { ConversationList } from "@/components/ConversationList";
import { MessageView } from "@/components/MessageView";
import { FileUpload } from "@/components/FileUpload";
import { AnalyticsSummary } from "@/components/AnalyticsSummary";
import { OnboardingModal } from "@/components/OnboardingModal";
import { Avatar, Button, Spinner } from "@/components/ui";
import { Header, Logo } from "@/components/layout";
import type { AnalyticsSummary as AnalyticsSummaryType } from "@/lib/supabase/types";
import type { Conversation } from "@/lib/supabase/types";

// Free tier limit
const FREE_TIER_CONVERSATION_LIMIT = 50;

// Compute prospect status counts from conversations
function computeProspectStatusCounts(conversations: Conversation[]) {
  const counts = {
    interested: 0,
    meeting_scheduled: 0,
    engaged: 0,
    no_response: 0,
    ghosted: 0,
    not_interested: 0,
    wrong_person: 0,
    closed: 0,
  };

  for (const conv of conversations) {
    if (conv.is_cold_outreach && conv.prospect_status) {
      const status = conv.prospect_status as keyof typeof counts;
      if (status in counts) {
        counts[status]++;
      }
    }
  }

  return counts;
}

// Compute responses by day of week (all time) to find best reach time
function computeResponsesByDayOfWeek(conversations: Conversation[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Count responses by day of week
  const responseCounts: Record<string, number> = {
    Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
  };

  for (const conv of conversations) {
    if (!conv.is_cold_outreach) continue;
    if (conv.total_messages_received <= 0) continue;
    
    // Use last_message_date to determine when responses came
    const lastMsgDate = new Date(conv.last_message_date);
    const dayName = days[lastMsgDate.getDay()];
    responseCounts[dayName]++;
  }

  const totalResponses = Object.values(responseCounts).reduce((sum, c) => sum + c, 0);
  
  // Return in order from Monday to Sunday
  const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return orderedDays.map(day => ({
    day,
    responses: responseCounts[day],
    percentage: totalResponses > 0 ? (responseCounts[day] / totalResponses) * 100 : 0,
  }));
}

interface DashboardUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

interface DashboardContentProps {
  user: DashboardUser;
  conversations: Conversation[];
  analytics: AnalyticsSummaryType | null;
}

export function DashboardContent({
  user,
  conversations: initialConversations,
  analytics: initialAnalytics,
}: DashboardContentProps) {
  const router = useRouter();

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(!user.firstName || !user.lastName);
  const [userFirstName, setUserFirstName] = useState(user.firstName);
  const [userLastName, setUserLastName] = useState(user.lastName);
  const fullName = `${userFirstName} ${userLastName}`.trim() || user.email;

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsSummaryType | null>(initialAnalytics);
  const [showImport, setShowImport] = useState(initialConversations.length === 0);

  // Import progress state
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);

  // Custom hooks
  const {
    conversations,
    displayConversations,
    selectedConversation,
    selectConversation,
    refreshConversations,
    importConversations,
    setConversations,
    clearLocalData,
  } = useConversations({
    userId: user.id,
    initialConversations,
    onImportProgress: (current, total) => setImportProgress({ current, total }),
  });

  const refreshAnalytics = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("analytics_summary")
      .select("*")
      .eq("user_id", user.id)
      .single();
    const analyticsData = data as AnalyticsSummaryType | null;
    // Only set analytics if there are conversations with data
    if (analyticsData && analyticsData.total_conversations && analyticsData.total_conversations > 0) {
      setAnalytics(analyticsData);
    } else {
      setAnalytics(null);
    }
  }, [user.id]);

  const handleAnalysisComplete = useCallback(async () => {
    clearLocalData();
    await refreshConversations();
    await refreshAnalytics();
  }, [clearLocalData, refreshConversations, refreshAnalytics]);

  // Called when analysis starts - refresh to show "analyzing" status on conversations
  const handleAnalysisStart = useCallback(async () => {
    await refreshConversations();
  }, [refreshConversations]);

  const {
    status: analysisStatus,
    isAnalyzing,
    error: analysisError,
    fetchStatus,
    triggerAnalysis,
    setIsAnalyzing,
  } = useAnalysis({
    userId: user.id,
    onComplete: handleAnalysisComplete,
    onStart: handleAnalysisStart,
  });

  // Apply free tier limit (must be before any conditional returns)
  const isOverLimit = displayConversations.length > FREE_TIER_CONVERSATION_LIMIT;
  const limitedConversations = useMemo(() => 
    displayConversations.slice(0, FREE_TIER_CONVERSATION_LIMIT),
    [displayConversations]
  );
  const hiddenCount = displayConversations.length - limitedConversations.length;
  const totalMessages = limitedConversations.reduce((acc, c) => acc + c.messageCount, 0);

  // Check initial analysis status (only on mount)
  useEffect(() => {
    if (showOnboarding) return;
    fetchStatus().then((status) => {
      if (status && status.analyzing > 0) {
        setIsAnalyzing(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnboarding]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "global" });
    router.push("/login");
    router.refresh();
  };

  const handleOnboardingComplete = (firstName: string, lastName: string) => {
    setUserFirstName(firstName);
    setUserLastName(lastName);
    setShowOnboarding(false);
  };

  const handleDataLoaded = async (data: Parameters<typeof importConversations>[0]) => {
    // Clear old analytics when importing new data
    setAnalytics(null);
    setImportProgress({ current: 0, total: data.conversations.length });
    await importConversations(data);
    setImportProgress(null);
    setShowImport(false);
    await fetchStatus();
  };

  const handleRefresh = async () => {
    clearLocalData();
    await refreshConversations();
    await refreshAnalytics();
    await fetchStatus();
  };

  const handleStopAnalysis = async () => {
    try {
      const response = await fetch("/api/analyze/stop", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`Failed to stop: ${data.error || "Unknown error"}`);
        return;
      }

      // Update UI state
      setIsAnalyzing(false);
      await fetchStatus();
      await refreshConversations();
    } catch (err) {
      alert(`Error: ${String(err)}`);
    }
  };

  const handleReanalyze = async () => {
    if (!confirm("This will reset all analysis data and re-analyze all conversations. Continue?")) {
      return;
    }

    try {
      // Reset all conversations to pending
      const response = await fetch("/api/analyze/reset", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        setAnalytics(null);
        alert(`Failed to reset: ${data.error || "Unknown error"}`);
        return;
      }

      // Clear local state
      setAnalytics(null);
      clearLocalData();
      await refreshConversations();
      await fetchStatus();
    } catch (err) {
      alert(`Error: ${String(err)}`);
    }
  };

  // Onboarding view
  if (showOnboarding) {
    return (
      <>
        <div className="min-h-screen flex flex-col bg-white opacity-50">
          <Header variant="centered">
            <Logo />
          </Header>
        </div>
        <OnboardingModal userId={user.id} onComplete={handleOnboardingComplete} />
      </>
    );
  }

  // Import view
  if (showImport) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header variant="centered">
          <div className="flex items-center justify-between">
            <Logo />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar src={user.avatarUrl} name={fullName} />
                <span className="text-sm text-zinc-600">{fullName}</span>
              </div>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </Header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                Import Your Messages
              </h2>
              <p className="text-zinc-500 text-sm">
                Upload your LinkedIn messages export to start analyzing
              </p>
            </div>

            <FileUpload onDataLoaded={handleDataLoaded} />

            {importProgress && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Spinner size="sm" />
                  <span className="text-sm font-medium text-purple-700">
                    Importing conversations...
                  </span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  {importProgress.current} / {importProgress.total} conversations
                </p>
              </div>
            )}

            {displayConversations.length > 0 && !importProgress && (
              <button
                onClick={() => setShowImport(false)}
                className="mt-6 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                ← Back to conversations
              </button>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="h-6 w-px bg-zinc-200" />
            <p className="text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">{limitedConversations.length}</span>
              {isOverLimit && (
                <span className="text-zinc-400">/{displayConversations.length}</span>
              )}
              {" "}conversations
              <span className="text-zinc-300 mx-2">·</span>
              <span className="text-zinc-400">{totalMessages.toLocaleString()} messages</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Analysis Controls */}
            {isAnalyzing ? (
              // Active analysis: show progress + stop button
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6039ed]/10 border border-[#6039ed]/20 rounded-lg">
                <Spinner size="sm" />
                <div className="text-sm">
                  <span className="text-[#6039ed] font-semibold">
                    {analysisStatus?.stageLabel || "Analyzing..."}
                  </span>
                  {analysisStatus && analysisStatus.progress !== null && analysisStatus.progressTotal !== null && (
                    <span className="text-[#6039ed]/60 ml-2 font-medium">
                      ({analysisStatus.progress}/{analysisStatus.progressTotal})
                    </span>
                  )}
                </div>
                <button
                  onClick={handleStopAnalysis}
                  className="ml-2 flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 transition-all px-2 py-1 rounded hover:bg-red-50 border border-red-200"
                  title="Stop analysis (can resume later)"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  Stop
                </button>
              </div>
            ) : (
              // Not analyzing: show action buttons
              <div className="flex items-center gap-2">
                {/* Analyze pending button */}
                {analysisStatus && analysisStatus.pending > 0 && (
                  <button
                    onClick={() => {
                      console.log("[Dashboard] Analyze button clicked!");
                      triggerAnalysis();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#6039ed] hover:bg-[#4c2bc4] text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Analyze {analysisStatus.pendingLimited?.toLocaleString() ?? analysisStatus.pending.toLocaleString()}
                    {analysisStatus.isOverLimit && (
                      <span className="text-white/60 text-xs ml-1">
                        (of {analysisStatus.pending.toLocaleString()})
                      </span>
                    )}
                  </button>
                )}
                
                {/* Re-analyze button - always visible when there are conversations */}
                {analysisStatus && analysisStatus.total > 0 && (
                  <button
                    onClick={handleReanalyze}
                    className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 text-zinc-600 text-sm font-medium rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                    title="Reset and re-analyze all conversations"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset
                  </button>
                )}
              </div>
            )}

            {analysisError && (
              <span className="text-xs text-red-500 max-w-xs truncate px-2 py-1 bg-red-50 rounded" title={analysisError}>
                ⚠ {analysisError}
              </span>
            )}

            <div className="h-6 w-px bg-zinc-200" />

            <Button variant="ghost" onClick={() => setShowImport(true)}>
              Import
            </Button>

            <Link
              href="/upgrade"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6039ed] to-[#4c2bc4] hover:from-[#5030d0] hover:to-[#4020b0] text-white text-sm font-semibold rounded-lg transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Upgrade
            </Link>

            <Avatar src={user.avatarUrl} name={fullName} />

            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </Header>

      {analytics && displayConversations.length > 0 && (!analysisStatus || analysisStatus.pending === 0) && (
        <AnalyticsSummary 
          analytics={analytics} 
          isLoading={isAnalyzing}
          totalConversations={conversations.length}
          coldOutreachCount={conversations.filter(c => c.is_cold_outreach === true).length}
          prospectStatusCounts={computeProspectStatusCounts(conversations)}
          responsesByDayOfWeek={computeResponsesByDayOfWeek(conversations)}
        />
      )}

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-zinc-100 overflow-hidden flex-shrink-0 flex flex-col">
          <ConversationList
            conversations={limitedConversations}
            selectedId={selectedConversation?.id ?? null}
            onSelect={selectConversation}
            currentUserName={fullName}
          />
          
          {/* Upgrade prompt when over limit */}
          {isOverLimit && (
            <div className="p-4 bg-gradient-to-r from-[#6039ed]/10 to-purple-500/10 border-t border-[#6039ed]/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6039ed]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900">
                    {hiddenCount} more conversation{hiddenCount > 1 ? 's' : ''} hidden
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Free plan limited to {FREE_TIER_CONVERSATION_LIMIT} conversations
                  </p>
                  <Link 
                    href="/pricing" 
                    className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#6039ed] hover:text-[#4c2bc4] transition-colors"
                  >
                    Upgrade to Pro
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-hidden">
          <MessageView
            conversation={selectedConversation}
            currentUserName={fullName}
          />
        </main>
      </div>
    </div>
  );
}
