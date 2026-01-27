"use client";

import type { AnalyticsSummary as AnalyticsSummaryType } from "@/lib/supabase/types";

interface AnalyticsSummaryProps {
  analytics: AnalyticsSummaryType;
  isLoading?: boolean;
}

function StatCard({
  label,
  value,
  suffix,
  isLoading,
}: {
  label: string;
  value: string | number | null;
  suffix?: string;
  isLoading?: boolean;
}) {
  return (
    <div className="bg-white border border-zinc-100 rounded-lg p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      {isLoading ? (
        <div className="h-7 flex items-center">
          <div className="w-4 h-4 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
        </div>
      ) : (
        <p className="text-xl font-semibold text-zinc-900">
          {value !== null ? value : "—"}
          {suffix && value !== null && (
            <span className="text-sm font-normal text-zinc-400 ml-1">
              {suffix}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

function formatResponseTime(minutes: number | null): string {
  if (minutes === null) return "—";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

export function AnalyticsSummary({ analytics, isLoading }: AnalyticsSummaryProps) {
  return (
    <div className="border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard
          label="Engagement Rate"
          value={analytics.avg_engagement_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
        />
        <StatCard
          label="Response Rate"
          value={analytics.response_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
        />
        <StatCard
          label="Avg Response Time"
          value={formatResponseTime(analytics.avg_response_time_minutes)}
          isLoading={isLoading}
        />
        <StatCard
          label="Follow-ups Sent"
          value={analytics.total_follow_ups}
          isLoading={isLoading}
        />
        <StatCard
          label="Outreach Score"
          value={analytics.avg_outreach_score?.toFixed(0) ?? null}
          suffix="/100"
          isLoading={isLoading}
        />
        <StatCard
          label="Market Pull"
          value={analytics.market_pull_score?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
        />
        <StatCard
          label="Total Convos"
          value={analytics.total_conversations}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
