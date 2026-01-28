"use client";

import { useState, useMemo } from "react";
import { Conversation } from "@/types/linkedin";
import { formatDistanceToNow } from "@/lib/utils";
import { Spinner } from "@/components/ui";

type ProspectFilter = "all" | "interested" | "meeting_scheduled" | "engaged" | "no_response" | "ghosted" | "not_interested";

const FILTER_OPTIONS: { value: ProspectFilter; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-zinc-100 text-zinc-600" },
  { value: "interested", label: "Interested", color: "bg-green-100 text-green-700" },
  { value: "meeting_scheduled", label: "Meeting", color: "bg-blue-100 text-blue-700" },
  { value: "engaged", label: "Engaged", color: "bg-yellow-100 text-yellow-700" },
  { value: "no_response", label: "No Response", color: "bg-zinc-100 text-zinc-500" },
  { value: "ghosted", label: "Ghosted", color: "bg-zinc-200 text-zinc-600" },
  { value: "not_interested", label: "Not Interested", color: "bg-red-100 text-red-700" },
];

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  currentUserName: string;
}

/**
 * Gets the display name for a conversation (the other participant's name)
 */
function getOtherParticipant(conversation: Conversation, currentUserName: string): string {
  const normalizedCurrentUser = currentUserName.toLowerCase().trim();

  const others = conversation.participants.filter(
    (p) => p.toLowerCase().trim() !== normalizedCurrentUser
  );

  return others[0] || conversation.title || "Unknown";
}

/**
 * Returns a status badge component based on prospect status
 */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string }> = {
    interested: { label: "Interested", color: "bg-green-100 text-green-700" },
    meeting_scheduled: { label: "Meeting", color: "bg-blue-100 text-blue-700" },
    engaged: { label: "Engaged", color: "bg-yellow-100 text-yellow-700" },
    not_interested: { label: "Not Interested", color: "bg-red-100 text-red-700" },
    wrong_person: { label: "Wrong Person", color: "bg-orange-100 text-orange-700" },
    ghosted: { label: "Ghosted", color: "bg-zinc-100 text-zinc-600" },
    no_response: { label: "No Response", color: "bg-zinc-100 text-zinc-500" },
    closed: { label: "Closed", color: "bg-purple-100 text-purple-700" },
  };

  const statusConfig = config[status];
  if (!statusConfig) return null;

  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  );
}

/**
 * Score indicator with color coding and tooltip
 */
function ScoreBadge({ score }: { score: number }) {
  const color = score >= 70 
    ? "text-green-600 bg-green-50" 
    : score >= 50 
      ? "text-yellow-600 bg-yellow-50" 
      : "text-red-600 bg-red-50";

  return (
    <span 
      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${color} cursor-help relative group`}
      title="Outreach Score"
    >
      {score}/100
      {/* Tooltip */}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 text-[10px] font-medium text-white bg-zinc-800 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 pointer-events-none z-10">
        Outreach Score
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800" />
      </span>
    </span>
  );
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  currentUserName,
}: ConversationListProps) {
  const [filter, setFilter] = useState<ProspectFilter>("all");

  const filteredConversations = useMemo(() => {
    if (filter === "all") return conversations;
    return conversations.filter((c) => c.prospectStatus === filter);
  }, [conversations, filter]);

  // Count conversations per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: conversations.length };
    conversations.forEach((c) => {
      if (c.prospectStatus) {
        counts[c.prospectStatus] = (counts[c.prospectStatus] || 0) + 1;
      }
    });
    return counts;
  }, [conversations]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-100">
        <h2 className="text-sm font-medium text-zinc-900">Conversations</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          {filteredConversations.length} {filter !== "all" ? `of ${conversations.length}` : "total"}
        </p>
      </div>

      {/* Filter dropdown */}
      <div className="px-4 py-2 border-b border-zinc-100">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ProspectFilter)}
            className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 pr-8 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#6039ed]/20 focus:border-[#6039ed] transition-all cursor-pointer"
          >
            {FILTER_OPTIONS.map((option) => {
              const count = statusCounts[option.value] || 0;
              // Don't show options with 0 count (except "all")
              if (option.value !== "all" && count === 0) return null;
              return (
                <option key={option.value} value={option.value}>
                  {option.label} ({count})
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-400">No conversations match this filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-xs text-[#6039ed] hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
          const displayName = getOtherParticipant(conversation, currentUserName);
          const isPending = conversation.analysisStatus === "pending";
          const isAnalyzing = conversation.analysisStatus === "analyzing";
          const isCompleted = conversation.analysisStatus === "completed";
          const isFailed = conversation.analysisStatus === "failed";

          return (
            <button
              key={conversation.id}
              onClick={() => onSelect(conversation.id)}
              className={`
                w-full p-4 text-left border-b border-zinc-50 transition-colors
                ${selectedId === conversation.id ? "bg-zinc-100" : "hover:bg-zinc-50"}
              `}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Name row with status indicator */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {displayName}
                    </p>
                    {/* Only show spinner when ACTIVELY analyzing, not when pending */}
                    {isAnalyzing && (
                      <div className="flex items-center gap-1">
                        <Spinner size="sm" />
                        <span className="text-[10px] text-[#6039ed]">Analyzing</span>
                      </div>
                    )}
                    {/* Show pending badge without spinner */}
                    {isPending && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-500">
                        Pending
                      </span>
                    )}
                    {isFailed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-500">
                        Failed
                      </span>
                    )}
                  </div>

                  {/* Message count */}
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {conversation.messageCount} messages
                  </p>

                  {/* Analysis results when completed */}
                  {isCompleted && (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {conversation.prospectStatus && (
                        <StatusBadge status={conversation.prospectStatus} />
                      )}
                      {conversation.outreachScoreOverall != null && (
                        <ScoreBadge score={conversation.outreachScoreOverall} />
                      )}
                      {conversation.engagementRate != null && (
                        <span className="text-[10px] text-zinc-400">
                          {conversation.engagementRate.toFixed(0)}% engaged
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Time column */}
                <div className="flex-shrink-0">
                  <span className="text-xs text-zinc-400">
                    {formatDistanceToNow(conversation.lastMessageDate)}
                  </span>
                </div>
              </div>
            </button>
          );
        })
        )}
      </div>
    </div>
  );
}
