"use client";

import { Conversation } from "@/types/linkedin";
import { formatDistanceToNow } from "@/lib/utils";
import { Spinner } from "@/components/ui";

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

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  currentUserName,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-100">
        <h2 className="text-sm font-medium text-zinc-900">Conversations</h2>
        <p className="text-xs text-zinc-400 mt-0.5">{conversations.length} total</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const displayName = getOtherParticipant(conversation, currentUserName);
          const isAnalyzingConv = conversation.analysisStatus === "pending" || conversation.analysisStatus === "analyzing";
          const isCompleted = conversation.analysisStatus === "completed";

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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900 truncate">
                      {displayName}
                    </p>
                    {isAnalyzingConv && <Spinner size="sm" />}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-zinc-500">
                      {conversation.messageCount} messages
                    </p>
                    {conversation.engagementRate != null && (
                      <span className="text-xs text-zinc-400">
                        · {conversation.engagementRate.toFixed(0)}% engaged
                      </span>
                    )}
                  </div>

                  {conversation.prospectStatus && isCompleted && (
                    <div className="mt-1.5">
                      <StatusBadge status={conversation.prospectStatus} />
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-zinc-400">
                    {formatDistanceToNow(conversation.lastMessageDate)}
                  </span>
                  {conversation.outreachScoreOverall != null && (
                    <span className="text-xs text-zinc-400">
                      {conversation.outreachScoreOverall.toFixed(0)}/100
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
