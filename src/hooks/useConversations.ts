"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/lib/supabase/types";
import type { LinkedInMessage, MessagesData, Conversation as LocalConversation } from "@/types/linkedin";

interface UseConversationsOptions {
  userId: string;
  initialConversations: Conversation[];
}

export function useConversations({ userId, initialConversations }: UseConversationsOptions) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [localMessagesData, setLocalMessagesData] = useState<MessagesData | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Map<string, LinkedInMessage[]>>(new Map());
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Filter to show only cold outreach conversations (or pending/analyzing ones)
  const filteredConversations = localMessagesData
    ? localMessagesData.conversations
    : conversations
        .filter((conv) => {
          // Show if not yet analyzed (pending/analyzing)
          if (conv.analysis_status === "pending" || conv.analysis_status === "analyzing") {
            return true;
          }
          // Show if it's confirmed cold outreach
          return conv.is_cold_outreach === true;
        })
        .map((conv) => ({
          id: conv.id,
          title: conv.title,
          participants: conv.participants,
          messages: selectedMessages.get(conv.id) || [],
          lastMessageDate: new Date(conv.last_message_date),
          messageCount: conv.message_count,
          analysisStatus: conv.analysis_status,
          isColdOutreach: conv.is_cold_outreach,
          engagementRate: conv.engagement_rate,
          prospectStatus: conv.prospect_status,
          outreachScoreOverall: conv.outreach_score_overall,
        }));

  const displayConversations: LocalConversation[] = filteredConversations;

  const selectedConversation = displayConversations.find(
    (c) => c.id === selectedConversationId
  ) ?? null;

  const selectConversation = useCallback(async (conversationId: string) => {
    setSelectedConversationId(conversationId);

    if (localMessagesData) return;
    if (selectedMessages.has(conversationId)) return;

    const supabase = createClient();
    const db = supabase as any;
    
    const { data: messagesData } = await db
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: true });

    const messages = messagesData as Message[] | null;

    if (messages) {
      const localMessages: LinkedInMessage[] = messages.map((msg) => ({
        conversationId: msg.linkedin_conversation_id,
        conversationTitle: "",
        from: msg.sender,
        senderProfileUrl: msg.sender_profile_url || "",
        to: msg.recipient || "",
        date: new Date(msg.sent_at),
        subject: msg.subject || "",
        content: msg.content,
        folder: msg.folder || "inbox",
      }));

      setSelectedMessages((prev) => new Map(prev).set(conversationId, localMessages));
    }
  }, [localMessagesData, selectedMessages]);

  const refreshConversations = useCallback(async () => {
    setLocalMessagesData(null);
    const supabase = createClient();
    const db = supabase as any;

    const { data: updatedConvosData } = await db
      .from("conversations")
      .select("*")
      .eq("user_id", userId)
      .order("last_message_date", { ascending: false });

    const updatedConvos = updatedConvosData as Conversation[] | null;

    if (updatedConvos) {
      setConversations(updatedConvos);
    }
  }, [userId]);

  const importConversations = useCallback(async (data: MessagesData) => {
    setLocalMessagesData(data);

    const supabase = createClient();
    const db = supabase as any;

    for (const conv of data.conversations) {
      const { data: savedConvData, error: convError } = await db
        .from("conversations")
        .upsert(
          {
            user_id: userId,
            linkedin_conversation_id: conv.id,
            title: conv.title,
            participants: conv.participants,
            last_message_date: conv.lastMessageDate.toISOString(),
            message_count: conv.messageCount,
            analysis_status: "pending",
          },
          { onConflict: "user_id,linkedin_conversation_id" }
        )
        .select()
        .single();

      const savedConv = savedConvData as Conversation | null;

      if (convError || !savedConv) continue;

      await db
        .from("messages")
        .delete()
        .eq("conversation_id", savedConv.id);

      const messagesToInsert = conv.messages.map((msg) => ({
        conversation_id: savedConv.id,
        linkedin_conversation_id: conv.id,
        sender: msg.from,
        sender_profile_url: msg.senderProfileUrl || null,
        recipient: msg.to || null,
        content: msg.content,
        subject: msg.subject || null,
        sent_at: msg.date.toISOString(),
        folder: msg.folder,
      }));

      if (messagesToInsert.length > 0) {
        await db.from("messages").insert(messagesToInsert);
      }
    }

    await refreshConversations();
  }, [userId, refreshConversations]);

  return {
    conversations,
    displayConversations,
    selectedConversation,
    selectedConversationId,
    localMessagesData,
    selectConversation,
    refreshConversations,
    importConversations,
    setConversations,
    clearLocalData: () => setLocalMessagesData(null),
  };
}
