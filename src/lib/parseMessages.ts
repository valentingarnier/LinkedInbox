import Papa from "papaparse";
import { LinkedInMessage, Conversation, MessagesData } from "@/types/linkedin";

interface RawMessage {
  "CONVERSATION ID": string;
  "CONVERSATION TITLE": string;
  FROM: string;
  "SENDER PROFILE URL": string;
  TO?: string;
  DATE: string;
  SUBJECT?: string;
  CONTENT: string;
  FOLDER?: string;
}

/**
 * Parses LinkedIn messages CSV export into structured data
 */
export function parseLinkedInMessages(csvContent: string): MessagesData {
  const result = Papa.parse<RawMessage>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim().toUpperCase(),
  });

  const messages: LinkedInMessage[] = result.data
    .filter((row) => row["CONVERSATION ID"] && row.CONTENT)
    .map((row) => ({
      conversationId: row["CONVERSATION ID"] || "",
      conversationTitle: row["CONVERSATION TITLE"] || "",
      from: row.FROM || "",
      senderProfileUrl: row["SENDER PROFILE URL"] || "",
      to: row.TO || "",
      date: new Date(row.DATE),
      subject: row.SUBJECT || "",
      content: row.CONTENT || "",
      folder: row.FOLDER || "inbox",
    }));

  // Group messages by conversation
  const conversationMap = new Map<string, LinkedInMessage[]>();
  messages.forEach((msg) => {
    const existing = conversationMap.get(msg.conversationId) || [];
    existing.push(msg);
    conversationMap.set(msg.conversationId, existing);
  });

  // Create conversation objects
  const conversations: Conversation[] = Array.from(conversationMap.entries())
    .map(([id, msgs]) => {
      const sortedMsgs = msgs.sort((a, b) => a.date.getTime() - b.date.getTime());

      // Collect all participants from both FROM and TO fields
      const allParticipants = new Set<string>();
      msgs.forEach((m) => {
        if (m.from) allParticipants.add(m.from);
        if (m.to) allParticipants.add(m.to);
      });
      const participants = [...allParticipants].filter(Boolean);

      return {
        id,
        title: msgs[0]?.conversationTitle || participants.join(", ") || "Unknown",
        participants,
        messages: sortedMsgs,
        lastMessageDate: sortedMsgs[sortedMsgs.length - 1]?.date || new Date(),
        messageCount: msgs.length,
      };
    })
    .sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());

  // Calculate date range
  const allDates = messages.map((m) => m.date.getTime()).filter((d) => !isNaN(d));
  const dateRange = {
    start: allDates.length > 0 ? new Date(Math.min(...allDates)) : null,
    end: allDates.length > 0 ? new Date(Math.max(...allDates)) : null,
  };

  return {
    conversations,
    totalMessages: messages.length,
    dateRange,
  };
}
