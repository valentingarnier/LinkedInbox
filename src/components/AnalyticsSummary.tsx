"use client";

import { useState } from "react";
import type { AnalyticsSummary as AnalyticsSummaryType } from "@/lib/supabase/types";

interface AnalyticsSummaryProps {
  analytics: AnalyticsSummaryType;
  isLoading?: boolean;
}

type Tab = "general" | "insights";

function StatCard({
  label,
  value,
  suffix,
  isLoading,
  trend,
  description,
}: {
  label: string;
  value: string | number | null;
  suffix?: string;
  isLoading?: boolean;
  trend?: { value: number; isPositive: boolean };
  description?: string;
}) {
  return (
    <div className="bg-white border border-zinc-100 rounded-xl p-5 hover:border-purple-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
        {trend && (
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
            trend.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      {isLoading ? (
        <div className="h-8 flex items-center">
          <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <p className="text-2xl font-bold text-zinc-900 tracking-tight">
            {value !== null ? value : "—"}
            {suffix && value !== null && (
              <span className="text-base font-normal text-zinc-400 ml-1">
                {suffix}
              </span>
            )}
          </p>
          {description && (
            <p className="text-xs text-zinc-400 mt-1">{description}</p>
          )}
        </>
      )}
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function formatResponseTime(minutes: number | null): string {
  if (minutes === null) return "—";
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
  return `${Math.round(minutes / 1440)}d`;
}

function GeneralStatsTab({ analytics, isLoading }: { analytics: AnalyticsSummaryType; isLoading?: boolean }) {
  return (
    <div className="space-y-6">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Response Rate"
          value={analytics.response_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Prospects who replied"
        />
        <StatCard
          label="Engagement Rate"
          value={analytics.avg_engagement_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Avg conversation balance"
        />
        <StatCard
          label="Market Pull"
          value={analytics.market_pull_score?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Interested + meetings"
        />
        <StatCard
          label="Outreach Score"
          value={analytics.avg_outreach_score?.toFixed(0) ?? null}
          suffix="/100"
          isLoading={isLoading}
          description="Message quality"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Conversations"
          value={analytics.total_conversations}
          isLoading={isLoading}
        />
        <StatCard
          label="Avg Response Time"
          value={formatResponseTime(analytics.avg_response_time_minutes)}
          isLoading={isLoading}
          description="Time to first reply"
        />
        <StatCard
          label="Follow-ups Sent"
          value={analytics.total_follow_ups}
          isLoading={isLoading}
          description="After initial outreach"
        />
      </div>
    </div>
  );
}

function InsightsTab() {
  // Mock data for the insights tab
  const mockData = {
    bestDayToSend: "Tuesday",
    bestTimeToSend: "10:00 AM",
    avgWordsPerMessage: 47,
    topPerformingOpener: "Noticed your work on...",
    prospectStatusBreakdown: [
      { status: "Interested", count: 12, color: "bg-emerald-500" },
      { status: "Engaged", count: 18, color: "bg-purple-500" },
      { status: "No Response", count: 45, color: "bg-zinc-300" },
      { status: "Not Interested", count: 8, color: "bg-red-400" },
      { status: "Meeting Scheduled", count: 5, color: "bg-blue-500" },
    ],
    weeklyActivity: [
      { day: "Mon", sent: 12, replies: 4 },
      { day: "Tue", sent: 18, replies: 8 },
      { day: "Wed", sent: 15, replies: 5 },
      { day: "Thu", sent: 20, replies: 9 },
      { day: "Fri", sent: 10, replies: 3 },
    ],
  };

  const totalProspects = mockData.prospectStatusBreakdown.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      {/* Timing insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Best Day"
          value={mockData.bestDayToSend}
          description="Highest response rate"
        />
        <StatCard
          label="Best Time"
          value={mockData.bestTimeToSend}
          description="Optimal send time"
        />
        <StatCard
          label="Avg Message Length"
          value={mockData.avgWordsPerMessage}
          suffix="words"
        />
        <div className="bg-white border border-zinc-100 rounded-xl p-5">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Top Opener</p>
          <p className="text-sm font-medium text-zinc-900 italic">"{mockData.topPerformingOpener}"</p>
          <p className="text-xs text-zinc-400 mt-1">32% response rate</p>
        </div>
      </div>

      {/* Prospect status breakdown */}
      <div className="bg-white border border-zinc-100 rounded-xl p-5">
        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-4">Prospect Status Breakdown</h4>
        <div className="space-y-3">
          {mockData.prospectStatusBreakdown.map((item) => (
            <div key={item.status}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-zinc-700">{item.status}</span>
                <span className="text-zinc-500">{item.count} ({((item.count / totalProspects) * 100).toFixed(0)}%)</span>
              </div>
              <ProgressBar value={item.count} max={totalProspects} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Weekly activity */}
      <div className="bg-white border border-zinc-100 rounded-xl p-5">
        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-4">Weekly Activity</h4>
        <div className="flex items-end justify-between h-24 gap-2">
          {mockData.weeklyActivity.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col gap-0.5">
                <div 
                  className="w-full bg-purple-500 rounded-t"
                  style={{ height: `${(day.sent / 20) * 60}px` }}
                  title={`${day.sent} sent`}
                />
                <div 
                  className="w-full bg-emerald-400 rounded-b"
                  style={{ height: `${(day.replies / 20) * 60}px` }}
                  title={`${day.replies} replies`}
                />
              </div>
              <span className="text-xs text-zinc-500">{day.day}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded" />
            <span className="text-xs text-zinc-500">Messages sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400 rounded" />
            <span className="text-xs text-zinc-500">Replies received</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsSummary({ analytics, isLoading }: AnalyticsSummaryProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="border-b border-zinc-100 bg-gradient-to-b from-zinc-50/80 to-white">
      {/* Tabs */}
      <div className="px-6 pt-4 border-b border-zinc-100">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              activeTab === "general"
                ? "text-purple-700 bg-white border border-zinc-100 border-b-white -mb-px"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            General Stats
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative ${
              activeTab === "insights"
                ? "text-purple-700 bg-white border border-zinc-100 border-b-white -mb-px"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            Insights
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-100 text-purple-600 rounded">Beta</span>
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-5">
        {activeTab === "general" ? (
          <GeneralStatsTab analytics={analytics} isLoading={isLoading} />
        ) : (
          <InsightsTab />
        )}
      </div>
    </div>
  );
}
