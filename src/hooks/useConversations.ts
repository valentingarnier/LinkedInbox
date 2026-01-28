"use client";

import { useState, useCallback } from "react";
import { createClient, fetchAllRows } from "@/lib/supabase/client";
import type { Conversation, Message } from "@/lib/supabase/types";
import type { LinkedInMessage, MessagesData, Conversation as LocalConversation } from "@/types/linkedin";

// Free tier limit
const FREE_TIER_CONVERSATION_LIMIT = 50;

interface UseConversationsOptions {
  userId: string;
  initialConversations: Conversation[];
  onImportProgress?: (progress: number, total: number) => void;
}

export function useConversations({ userId, initialConversations, onImportProgress }: UseConversationsOptions) {
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

    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("sent_at", { ascending: true });

    const messages = data as Message[] | null;

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

    // Fetch ALL conversations using pagination helper
    const allConversations = await fetchAllRows<Conversation>(supabase, "conversations", {
      eq: { user_id: userId },
      order: { column: "last_message_date", ascending: false },
    });

    setConversations(allConversations);
  }, [userId]);

  const importConversations = useCallback(async (data: MessagesData) => {
    const supabase = createClient();

    // Fetch existing conversation IDs for this user
    const existingConvs = await fetchAllRows<{ linkedin_conversation_id: string }>(
      supabase,
      "conversations",
      { select: "linkedin_conversation_id", eq: { user_id: userId } }
    );

    const existingCount = existingConvs.length;
    const existingConvIds = new Set(existingConvs.map((c) => c.linkedin_conversation_id));

    // Filter to only new conversations
    let newConversations = data.conversations.filter(
      (conv) => !existingConvIds.has(conv.id)
    );

    // Apply free tier limit - only import up to the limit
    const remainingSlots = Math.max(0, FREE_TIER_CONVERSATION_LIMIT - existingCount);
    
    if (remainingSlots === 0) {
      // User already has max conversations
      console.log(`[Import] User already at limit (${existingCount}/${FREE_TIER_CONVERSATION_LIMIT})`);
      onImportProgress?.(0, 0);
      await refreshConversations();
      return;
    }

    if (newConversations.length > remainingSlots) {
      // Sort by most recent first, then take only what fits
      newConversations = newConversations
        .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime())
        .slice(0, remainingSlots);
      console.log(`[Import] Limited to ${remainingSlots} conversations (free tier limit: ${FREE_TIER_CONVERSATION_LIMIT})`);
    }

    if (newConversations.length === 0) {
      onImportProgress?.(data.conversations.length, data.conversations.length);
      await refreshConversations();
      return;
    }

    // Set local preview with limited conversations
    setLocalMessagesData({
      ...data,
      conversations: newConversations,
    });

    // Batch size for parallel processing
    const BATCH_SIZE = 50;
    const totalNew = newConversations.length;

    // Process in batches
    for (let i = 0; i < newConversations.length; i += BATCH_SIZE) {
      // Report progress
      onImportProgress?.(Math.min(i + BATCH_SIZE, totalNew), totalNew);
      const batch = newConversations.slice(i, i + BATCH_SIZE);

      // Prepare conversation records for batch insert
      const conversationRecords = batch.map((conv) => ({
        user_id: userId,
        linkedin_conversation_id: conv.id,
        title: conv.title,
        participants: conv.participants,
        last_message_date: conv.lastMessageDate.toISOString(),
        message_count: conv.messageCount,
        analysis_status: "pending",
      }));

      // Batch insert conversations (no upsert needed since we filtered)
      // Type assertion needed due to Supabase SSR client generic limitations
      const { data: savedConvsData, error: convError } = await (supabase.from("conversations") as any)
        .insert(conversationRecords)
        .select("id, linkedin_conversation_id");

      if (convError || !savedConvsData) {
        console.error("Failed to insert conversations batch:", convError);
        continue;
      }

      const savedConvs = savedConvsData as Array<{ id: string; linkedin_conversation_id: string }>;

      // Create a map for quick lookup
      const convIdMap = new Map(savedConvs.map((c) => [c.linkedin_conversation_id, c.id]));

      // Prepare all messages for batch insert
      const allMessages: Array<{
        conversation_id: string;
        linkedin_conversation_id: string;
        sender: string;
        sender_profile_url: string | null;
        recipient: string | null;
        content: string;
        subject: string | null;
        sent_at: string;
        folder: string;
      }> = [];

      for (const conv of batch) {
        const dbConvId = convIdMap.get(conv.id);
        if (!dbConvId) continue;

        for (const msg of conv.messages) {
          allMessages.push({
            conversation_id: dbConvId,
            linkedin_conversation_id: conv.id,
            sender: msg.from,
            sender_profile_url: msg.senderProfileUrl || null,
            recipient: msg.to || null,
            content: msg.content,
            subject: msg.subject || null,
            sent_at: msg.date.toISOString(),
            folder: msg.folder,
          });
        }
      }

      // Insert messages in chunks (Supabase has limits on request size)
      const MESSAGE_CHUNK_SIZE = 500;
      for (let j = 0; j < allMessages.length; j += MESSAGE_CHUNK_SIZE) {
        const messageChunk = allMessages.slice(j, j + MESSAGE_CHUNK_SIZE);
        // Type assertion needed due to Supabase SSR client generic limitations
        const { error: msgError } = await (supabase.from("messages") as any).insert(messageChunk);
        if (msgError) {
          console.error("Failed to insert messages chunk:", msgError);
        }
      }
    }

    await refreshConversations();
  }, [userId, onImportProgress, refreshConversations]);

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
