"use client";

import { Conversation, LinkedInMessage } from "@/types/linkedin";
import { formatDate } from "@/lib/utils";

interface MessageViewProps {
  conversation: Conversation | null;
  currentUserName: string;
}

function getOtherParticipants(conversation: Conversation, currentUserName: string): string {
  const normalizedCurrentUser = currentUserName.toLowerCase().trim();
  
  const others = conversation.participants.filter(
    (p) => p.toLowerCase().trim() !== normalizedCurrentUser
  );

  if (others.length > 0) {
    return others[0];
  }

  return conversation.title || "Unknown";
}

function MessageBubble({
  message,
  isFirst,
  isCurrentUser,
}: {
  message: LinkedInMessage;
  isFirst: boolean;
  isCurrentUser: boolean;
}) {
  return (
    <div className={`py-3 ${!isCurrentUser ? "pl-8" : ""}`}>
      {isFirst && (
        <div className={`flex items-center gap-2 mb-2 ${!isCurrentUser ? "justify-end" : ""}`}>
          {isCurrentUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">You</span>
            </div>
          )}
          <div className={!isCurrentUser ? "text-right" : ""}>
            <p className="text-sm font-medium text-zinc-900">
              {isCurrentUser ? "You" : message.from}
            </p>
            <p className="text-xs text-zinc-400">{formatDate(message.date)}</p>
          </div>
          {!isCurrentUser && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center">
              <span className="text-xs font-medium text-zinc-600">
                {message.from.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}
      {!isFirst && (
        <p className={`text-xs text-zinc-400 mb-1 ${!isCurrentUser ? "mr-10 text-right" : "ml-10"}`}>
          {formatDate(message.date)}
        </p>
      )}
      <div className={!isCurrentUser ? "mr-10 text-right" : "ml-10"}>
        <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed inline-block text-left">
          {message.content}
        </p>
      </div>
    </div>
  );
}

export function MessageView({ conversation, currentUserName }: MessageViewProps) {
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-400">
        <div className="text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-zinc-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="text-sm">Select a conversation to view messages</p>
        </div>
      </div>
    );
  }

  const normalizedCurrentUser = currentUserName.toLowerCase().trim();
  const otherPerson = getOtherParticipants(conversation, currentUserName);
  let lastSender = "";

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-100">
        <h2 className="text-sm font-medium text-zinc-900">{otherPerson}</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          {conversation.messageCount} messages
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 divide-y divide-zinc-50">
        {conversation.messages.map((message, index) => {
          const isFirst = message.from !== lastSender;
          const isCurrentUser = message.from.toLowerCase().trim() === normalizedCurrentUser;
          lastSender = message.from;
          return (
            <MessageBubble
              key={`${message.conversationId}-${index}`}
              message={message}
              isFirst={isFirst}
              isCurrentUser={isCurrentUser}
            />
          );
        })}
      </div>
    </div>
  );
}
