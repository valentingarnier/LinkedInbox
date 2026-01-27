import type { AnalysisStatus, ProspectStatus } from "@/lib/supabase/types";

export interface LinkedInMessage {
  conversationId: string;
  conversationTitle: string;
  from: string;
  senderProfileUrl: string;
  to: string;
  date: Date;
  subject: string;
  content: string;
  folder: string;
}

export interface Conversation {
  id: string;
  title: string;
  participants: string[];
  messages: LinkedInMessage[];
  lastMessageDate: Date;
  messageCount: number;
  // Analysis fields (optional, from DB)
  analysisStatus?: AnalysisStatus;
  engagementRate?: number | null;
  prospectStatus?: ProspectStatus;
  outreachScoreOverall?: number | null;
}

export interface MessagesData {
  conversations: Conversation[];
  totalMessages: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}
