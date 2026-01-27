"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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

  // Custom hooks
  const {
    displayConversations,
    selectedConversation,
    selectConversation,
    refreshConversations,
    importConversations,
    setConversations,
    clearLocalData,
  } = useConversations({ userId: user.id, initialConversations });

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
  });

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
    await importConversations(data);
    setShowImport(false);
    await fetchStatus();
  };

  const handleRefresh = async () => {
    clearLocalData();
    await refreshConversations();
    await refreshAnalytics();
    await fetchStatus();
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

            {displayConversations.length > 0 && (
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
  const totalMessages = displayConversations.reduce((acc, c) => acc + c.messageCount, 0);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <div className="ml-2">
              <p className="text-xs text-zinc-400">
                {totalMessages.toLocaleString()} messages · {displayConversations.length} conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {analysisError && (
              <span className="text-xs text-red-500 max-w-xs truncate" title={analysisError}>
                Error: {analysisError}
              </span>
            )}

            {analysisStatus && analysisStatus.pending > 0 && !isAnalyzing && (
              <Button onClick={triggerAnalysis} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze {analysisStatus.pending} conversations
              </Button>
            )}

            {isAnalyzing && (
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <div className="text-sm">
                  <span className="text-purple-600 font-medium">
                    {analysisStatus?.stageLabel || "Analyzing..."}
                  </span>
                  {analysisStatus && analysisStatus.progress !== null && analysisStatus.progressTotal !== null && (
                    <span className="text-zinc-400 ml-2">
                      ({analysisStatus.progress}/{analysisStatus.progressTotal})
                    </span>
                  )}
                </div>
              </div>
            )}

            {!isAnalyzing && analysisStatus && analysisStatus.completed > 0 && (
              <>
                <button
                  onClick={handleRefresh}
                  className="text-zinc-500 hover:text-zinc-700 transition-colors p-1"
                  title="Refresh data"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={handleReanalyze}
                  className="text-xs text-zinc-500 hover:text-orange-600 transition-colors px-2 py-1 rounded hover:bg-orange-50"
                  title="Re-analyze all conversations (reset and run again)"
                >
                  Re-analyze
                </button>
              </>
            )}

            <Button variant="ghost" onClick={() => setShowImport(true)}>
              Import new file
            </Button>

            <Avatar src={user.avatarUrl} name={fullName} />

            <Button variant="ghost" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        </div>
      </Header>

      {analytics && displayConversations.length > 0 && (!analysisStatus || analysisStatus.pending === 0) && (
        <AnalyticsSummary analytics={analytics} isLoading={isAnalyzing} />
      )}

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-zinc-100 overflow-hidden flex-shrink-0">
          <ConversationList
            conversations={displayConversations}
            selectedId={selectedConversation?.id ?? null}
            onSelect={selectConversation}
            currentUserName={fullName}
          />
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
