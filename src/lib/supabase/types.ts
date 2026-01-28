export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AnalysisStatus = "pending" | "analyzing" | "completed" | "failed";

export type ProspectStatus =
  | "no_response"
  | "engaged"
  | "interested"
  | "meeting_scheduled"
  | "not_interested"
  | "wrong_person"
  | "ghosted"
  | "closed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          linkedin_conversation_id: string;
          title: string;
          participants: string[];
          last_message_date: string;
          message_count: number;
          created_at: string;
          updated_at: string;
          // Analysis fields
          analysis_status: AnalysisStatus;
          analysis_error: string | null;
          analyzed_at: string | null;
          // Cold outreach classification
          is_cold_outreach: boolean | null;
          cold_outreach_reasoning: string | null;
          // Basic metrics
          engagement_rate: number | null;
          avg_response_time_minutes: number | null;
          follow_up_pressure_score: number | null;
          total_messages_sent: number;
          total_messages_received: number;
          consecutive_follow_ups: number;
          // Prospect status (LLM)
          prospect_status: ProspectStatus;
          prospect_status_confidence: number | null;
          prospect_status_reasoning: string | null;
          // Outreach score (LLM)
          outreach_score_overall: number | null;
          outreach_score_personalization: number | null;
          outreach_score_value_proposition: number | null;
          outreach_score_call_to_action: number | null;
          outreach_score_tone: number | null;
          outreach_score_brevity: number | null;
          outreach_score_originality: number | null;
          outreach_feedback: string | null;
          outreach_suggestions: string[] | null;
          // Template clustering
          template_cluster_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          linkedin_conversation_id: string;
          title: string;
          participants: string[];
          last_message_date: string;
          message_count: number;
          created_at?: string;
          updated_at?: string;
          analysis_status?: AnalysisStatus;
          analysis_error?: string | null;
          analyzed_at?: string | null;
          is_cold_outreach?: boolean | null;
          cold_outreach_reasoning?: string | null;
          engagement_rate?: number | null;
          avg_response_time_minutes?: number | null;
          follow_up_pressure_score?: number | null;
          total_messages_sent?: number;
          total_messages_received?: number;
          consecutive_follow_ups?: number;
          prospect_status?: ProspectStatus;
          prospect_status_confidence?: number | null;
          prospect_status_reasoning?: string | null;
          outreach_score_overall?: number | null;
          outreach_score_personalization?: number | null;
          outreach_score_value_proposition?: number | null;
          outreach_score_call_to_action?: number | null;
          outreach_score_tone?: number | null;
          outreach_score_brevity?: number | null;
          outreach_score_originality?: number | null;
          outreach_feedback?: string | null;
          outreach_suggestions?: string[] | null;
          template_cluster_id?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          linkedin_conversation_id?: string;
          title?: string;
          participants?: string[];
          last_message_date?: string;
          message_count?: number;
          created_at?: string;
          updated_at?: string;
          analysis_status?: AnalysisStatus;
          analysis_error?: string | null;
          analyzed_at?: string | null;
          is_cold_outreach?: boolean | null;
          cold_outreach_reasoning?: string | null;
          engagement_rate?: number | null;
          avg_response_time_minutes?: number | null;
          follow_up_pressure_score?: number | null;
          total_messages_sent?: number;
          total_messages_received?: number;
          consecutive_follow_ups?: number;
          prospect_status?: ProspectStatus;
          prospect_status_confidence?: number | null;
          prospect_status_reasoning?: string | null;
          outreach_score_overall?: number | null;
          outreach_score_personalization?: number | null;
          outreach_score_value_proposition?: number | null;
          outreach_score_call_to_action?: number | null;
          outreach_score_tone?: number | null;
          outreach_score_brevity?: number | null;
          outreach_score_originality?: number | null;
          outreach_feedback?: string | null;
          outreach_suggestions?: string[] | null;
          template_cluster_id?: string | null;
        };
      };
      message_templates: {
        Row: {
          id: string;
          user_id: string;
          cluster_id: string;
          label: string;
          description: string | null;
          pattern_example: string | null;
          conversation_count: number;
          response_rate: number | null;
          interest_rate: number | null;
          ghost_rate: number | null;
          avg_engagement: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          cluster_id: string;
          label: string;
          description?: string | null;
          pattern_example?: string | null;
          conversation_count?: number;
          response_rate?: number | null;
          interest_rate?: number | null;
          ghost_rate?: number | null;
          avg_engagement?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          cluster_id?: string;
          label?: string;
          description?: string | null;
          pattern_example?: string | null;
          conversation_count?: number;
          response_rate?: number | null;
          interest_rate?: number | null;
          ghost_rate?: number | null;
          avg_engagement?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          linkedin_conversation_id: string;
          sender: string;
          sender_profile_url: string | null;
          recipient: string | null;
          content: string;
          subject: string | null;
          sent_at: string;
          folder: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          linkedin_conversation_id: string;
          sender: string;
          sender_profile_url?: string | null;
          recipient?: string | null;
          content: string;
          subject?: string | null;
          sent_at: string;
          folder?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          linkedin_conversation_id?: string;
          sender?: string;
          sender_profile_url?: string | null;
          recipient?: string | null;
          content?: string;
          subject?: string | null;
          sent_at?: string;
          folder?: string;
          created_at?: string;
        };
      };
      imports: {
        Row: {
          id: string;
          user_id: string;
          file_name: string;
          total_messages: number;
          total_conversations: number;
          status: "pending" | "processing" | "completed" | "failed";
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_name: string;
          total_messages?: number;
          total_conversations?: number;
          status?: "pending" | "processing" | "completed" | "failed";
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_name?: string;
          total_messages?: number;
          total_conversations?: number;
          status?: "pending" | "processing" | "completed" | "failed";
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      analytics_summary: {
        Row: {
          id: string;
          user_id: string;
          avg_engagement_rate: number | null;
          response_rate: number | null;
          avg_response_time_minutes: number | null;
          total_follow_ups: number | null;
          avg_outreach_score: number | null;
          total_conversations: number | null;
          market_pull_score: number | null;
          hot_prospects: string[] | null;
          computed_at: string;
          // Analysis progress tracking
          analysis_stage: string | null;
          analysis_progress: number | null;
          analysis_total: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          avg_engagement_rate?: number | null;
          response_rate?: number | null;
          avg_response_time_minutes?: number | null;
          total_follow_ups?: number | null;
          avg_outreach_score?: number | null;
          total_conversations?: number | null;
          market_pull_score?: number | null;
          hot_prospects?: string[] | null;
          computed_at?: string;
          analysis_stage?: string | null;
          analysis_progress?: number | null;
          analysis_total?: number | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          avg_engagement_rate?: number | null;
          response_rate?: number | null;
          avg_response_time_minutes?: number | null;
          total_follow_ups?: number | null;
          avg_outreach_score?: number | null;
          total_conversations?: number | null;
          market_pull_score?: number | null;
          hot_prospects?: string[] | null;
          computed_at?: string;
          analysis_stage?: string | null;
          analysis_progress?: number | null;
          analysis_total?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      import_status: "pending" | "processing" | "completed" | "failed";
      analysis_status: AnalysisStatus;
      prospect_status: ProspectStatus;
    };
  };
}

// Helper types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Import = Database["public"]["Tables"]["imports"]["Row"];
export type AnalyticsSummary = Database["public"]["Tables"]["analytics_summary"]["Row"];
export type MessageTemplate = Database["public"]["Tables"]["message_templates"]["Row"];