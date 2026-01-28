"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AnalyticsSummary as AnalyticsSummaryType, MessageTemplate } from "@/lib/supabase/types";

interface ProspectStatusCounts {
  interested: number;
  meeting_scheduled: number;
  engaged: number;
  no_response: number;
  ghosted: number;
  not_interested: number;
  wrong_person: number;
  closed: number;
}

interface DayOfWeekResponses {
  day: string;
  responses: number;
  percentage: number;
}

interface AnalyticsSummaryProps {
  analytics: AnalyticsSummaryType;
  isLoading?: boolean;
  totalConversations?: number;
  coldOutreachCount?: number;
  prospectStatusCounts?: ProspectStatusCounts;
  responsesByDayOfWeek?: DayOfWeekResponses[];
}

type Tab = "general" | "insights";

function StatCard({
  label,
  value,
  suffix,
  isLoading,
  trend,
  description,
  variant = "default",
}: {
  label: string;
  value: string | number | null;
  suffix?: string;
  isLoading?: boolean;
  trend?: { value: number; isPositive: boolean };
  description?: string;
  variant?: "default" | "highlight";
}) {
  const isHighlight = variant === "highlight";
  
  return (
    <div className={`
      relative overflow-hidden rounded-xl p-4 transition-all duration-200
      ${isHighlight 
        ? "bg-[#6039ed] text-white shadow-sm" 
        : "bg-white border border-zinc-100 hover:border-[#6039ed]/30 hover:shadow-sm"
      }
    `}>
      {isHighlight && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
      )}
      <div className="relative">
        <div className="flex items-start justify-between mb-1.5">
          <p className={`text-[11px] font-medium uppercase tracking-wide ${
            isHighlight ? "text-white/70" : "text-zinc-400"
          }`}>{label}</p>
          {trend && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
              trend.isPositive 
                ? isHighlight ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600" 
                : isHighlight ? "bg-white/20 text-white" : "bg-red-50 text-red-600"
            }`}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
        {isLoading ? (
          <div className="h-7 flex items-center">
            <div className={`w-4 h-4 border-2 rounded-full animate-spin ${
              isHighlight ? "border-white/30 border-t-white" : "border-[#6039ed]/30 border-t-[#6039ed]"
            }`} />
          </div>
        ) : (
          <>
            <p className={`text-xl font-bold tracking-tight ${isHighlight ? "text-white" : "text-zinc-900"}`}>
              {value !== null ? value : "—"}
              {suffix && value !== null && (
                <span className={`text-sm font-normal ml-0.5 ${isHighlight ? "text-white/60" : "text-zinc-400"}`}>
                  {suffix}
                </span>
              )}
            </p>
            {description && (
              <p className={`text-[11px] mt-0.5 ${isHighlight ? "text-white/60" : "text-zinc-400"}`}>{description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
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

function GeneralStatsTab({ 
  analytics, 
  isLoading,
  totalConversations,
  coldOutreachCount,
}: { 
  analytics: AnalyticsSummaryType; 
  isLoading?: boolean;
  totalConversations?: number;
  coldOutreachCount?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Market Pull"
          value={analytics.market_pull_score?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Interested + meetings"
          variant="highlight"
        />
        <StatCard
          label="Response Rate"
          value={analytics.response_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Prospects who replied"
        />
        <StatCard
          label="Engagement"
          value={analytics.avg_engagement_rate?.toFixed(1) ?? null}
          suffix="%"
          isLoading={isLoading}
          description="Conversation balance"
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
      <div className="grid grid-cols-3 gap-3">
        <div className="relative overflow-hidden rounded-xl p-4 bg-white border border-zinc-100 hover:border-[#6039ed]/30 hover:shadow-sm transition-all duration-200">
          <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide mb-1.5">Conversations</p>
          {isLoading ? (
            <div className="h-7 flex items-center">
              <div className="w-4 h-4 border-2 border-[#6039ed]/30 border-t-[#6039ed] rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-xl font-bold text-zinc-900 tracking-tight">
                {totalConversations ?? analytics.total_conversations ?? "—"}
              </p>
              <p className="text-[11px] text-[#6039ed] mt-0.5 font-medium">
                {coldOutreachCount ?? analytics.total_conversations ?? 0} cold outreach
              </p>
            </>
          )}
        </div>
        <StatCard
          label="Avg Response Time"
          value={formatResponseTime(analytics.avg_response_time_minutes)}
          isLoading={isLoading}
          description="Time to first reply"
        />
        <StatCard
          label="Follow-ups"
          value={analytics.total_follow_ups}
          isLoading={isLoading}
          description="After initial outreach"
        />
      </div>
    </div>
  );
}

function TemplateCard({ 
  template, 
  rank 
}: { 
  template: MessageTemplate; 
  rank: number;
}) {
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "📊";
  };

  const getInterestColor = (rate: number) => {
    if (rate >= 30) return "text-emerald-600 bg-emerald-50";
    if (rate >= 15) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="relative overflow-hidden rounded-xl p-4 bg-white border border-zinc-100 hover:border-[#6039ed]/30 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-3">
        <span className="text-xl">{getRankEmoji(rank)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-zinc-900 truncate">
              {template.label}
            </h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${getInterestColor(template.interest_rate || 0)}`}>
              {(template.interest_rate || 0).toFixed(0)}% interest
            </span>
          </div>
          
          {template.description && (
            <p className="text-xs text-zinc-500 mb-2 line-clamp-2">
              {template.description}
            </p>
          )}
          
          {template.pattern_example && (
            <p className="text-xs text-zinc-400 italic mb-3 line-clamp-2 bg-zinc-50 rounded p-2">
              "{template.pattern_example}"
            </p>
          )}
          
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">Used:</span>
              <span className="font-medium text-zinc-600">{template.conversation_count}x</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">Response:</span>
              <span className="font-medium text-zinc-600">{(template.response_rate || 0).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-400">Ghost:</span>
              <span className="font-medium text-zinc-600">{(template.ghost_rate || 0).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interest rate bar */}
      <div className="mt-3">
        <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6039ed] to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (template.interest_rate || 0) * 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ProspectStatusChart({ counts }: { counts: ProspectStatusCounts }) {
  const statusConfig: Array<{ key: keyof ProspectStatusCounts; label: string; color: string }> = [
    { key: "interested", label: "Interested", color: "bg-emerald-500" },
    { key: "meeting_scheduled", label: "Meeting", color: "bg-blue-500" },
    { key: "engaged", label: "Engaged", color: "bg-yellow-500" },
    { key: "no_response", label: "No Response", color: "bg-zinc-300" },
    { key: "ghosted", label: "Ghosted", color: "bg-zinc-400" },
    { key: "not_interested", label: "Not Interested", color: "bg-red-400" },
  ];

  const maxCount = Math.max(...statusConfig.map(s => counts[s.key] || 0), 1);

  return (
    <div className="space-y-2">
      {statusConfig.map(({ key, label, color }) => {
        const count = counts[key] || 0;
        const percentage = (count / maxCount) * 100;
        return (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 w-20 truncate">{label}</span>
            <div className="flex-1 h-4 bg-zinc-100 rounded overflow-hidden">
              <div 
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-medium text-zinc-600 w-8 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
}

function BestTimeChart({ data }: { data: DayOfWeekResponses[] }) {
  const maxResponses = Math.max(...data.map(d => d.responses), 1);
  const bestDay = data.reduce((best, current) => 
    current.responses > best.responses ? current : best, data[0]);

  return (
    <div className="space-y-1.5">
      {data.map((day) => {
        const isBest = day.day === bestDay.day && day.responses > 0;
        return (
          <div key={day.day} className="flex items-center gap-2">
            <span className={`text-[10px] w-8 ${isBest ? 'text-[#6039ed] font-semibold' : 'text-zinc-500'}`}>
              {day.day}
            </span>
            <div className="flex-1 h-3 bg-zinc-100 rounded overflow-hidden">
              <div 
                className={`h-full rounded transition-all duration-500 ${isBest ? 'bg-[#6039ed]' : 'bg-zinc-300'}`}
                style={{ width: `${(day.responses / maxResponses) * 100}%` }}
              />
            </div>
            <span className={`text-[10px] w-6 text-right ${isBest ? 'text-[#6039ed] font-semibold' : 'text-zinc-500'}`}>
              {day.responses}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function InsightsTab({ 
  prospectStatusCounts,
  responsesByDayOfWeek,
}: { 
  prospectStatusCounts?: ProspectStatusCounts;
  responsesByDayOfWeek?: DayOfWeekResponses[];
}) {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/templates", { credentials: "include" });
        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }
        const data = await response.json();
        setTemplates(data || []);
      } catch (err) {
        setError(String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Default data if not provided
  const statusCounts = prospectStatusCounts || {
    interested: 0, meeting_scheduled: 0, engaged: 0,
    no_response: 0, ghosted: 0, not_interested: 0, wrong_person: 0, closed: 0
  };

  const dayOfWeekData = responsesByDayOfWeek || [
    { day: "Mon", responses: 0, percentage: 0 },
    { day: "Tue", responses: 0, percentage: 0 },
    { day: "Wed", responses: 0, percentage: 0 },
    { day: "Thu", responses: 0, percentage: 0 },
    { day: "Fri", responses: 0, percentage: 0 },
    { day: "Sat", responses: 0, percentage: 0 },
    { day: "Sun", responses: 0, percentage: 0 },
  ];

  const totalResponses = dayOfWeekData.reduce((sum, d) => sum + d.responses, 0);
  const bestDay = dayOfWeekData.reduce((best, current) => 
    current.responses > best.responses ? current : best, dayOfWeekData[0]);

  return (
    <div className="space-y-4">
      {/* Two-column layout for charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prospect Status Distribution */}
        <div className="bg-white border border-zinc-100 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide mb-3">
            Prospect Status
          </h4>
          <ProspectStatusChart counts={statusCounts} />
        </div>

        {/* Best Time to Reach */}
        <div className="bg-white border border-zinc-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
              Best Time to Reach
            </h4>
            {bestDay.responses > 0 && (
              <span className="text-xs text-[#6039ed] font-medium">Best: {bestDay.day}</span>
            )}
          </div>
          <BestTimeChart data={dayOfWeekData} />
          <p className="text-[10px] text-zinc-400 mt-2 text-center">
            {totalResponses} total responses analyzed
          </p>
        </div>
      </div>

      {/* Template Performance - Compact */}
      <div className="bg-white border border-zinc-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wide">
            Top Templates
          </h4>
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-[#6039ed]/30 border-t-[#6039ed] rounded-full animate-spin" />
          ) : templates.length > 0 ? (
            <Link 
              href="/dashboard/templates"
              className="text-[10px] text-[#6039ed] font-medium hover:underline"
            >
              View all {templates.length} →
            </Link>
          ) : null}
        </div>

        {isLoading ? (
          <div className="py-4 text-center">
            <p className="text-xs text-zinc-400">Loading templates...</p>
          </div>
        ) : error ? (
          <div className="py-4 text-center">
            <p className="text-xs text-red-500">{error}</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-xs text-zinc-500">No template patterns found yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {templates.slice(0, 3).map((template, index) => (
              <div 
                key={template.id} 
                className="flex items-center gap-3 p-2 bg-zinc-50 rounded-lg"
              >
                <span className="text-sm">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-800 truncate">{template.label}</p>
                  <p className="text-[10px] text-zinc-400">{template.conversation_count}x used</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  (template.interest_rate || 0) >= 20 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-zinc-100 text-zinc-600"
                }`}>
                  {(template.interest_rate || 0).toFixed(0)}%
                </span>
              </div>
            ))}
            {templates.length > 3 && (
              <Link 
                href="/dashboard/templates"
                className="block text-[10px] text-[#6039ed] text-center pt-2 hover:underline"
              >
                +{templates.length - 3} more templates
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AnalyticsSummary({ 
  analytics, 
  isLoading, 
  totalConversations, 
  coldOutreachCount,
  prospectStatusCounts,
  responsesByDayOfWeek,
}: AnalyticsSummaryProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="relative bg-zinc-50 border-b border-zinc-200">
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6039ed]/[0.02] via-transparent to-transparent" />

      <div className="relative">
        {/* Tabs */}
        <div className="px-6 pt-4 pb-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab("general")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Overview
              {activeTab === "general" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6039ed] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("insights")}
              className={`relative pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === "insights"
                  ? "text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Insights
              {activeTab === "insights" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6039ed] rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-zinc-200" />

        {/* Tab content */}
        <div className="px-6 py-5">
          {activeTab === "general" ? (
            <GeneralStatsTab 
              analytics={analytics} 
              isLoading={isLoading}
              totalConversations={totalConversations}
              coldOutreachCount={coldOutreachCount}
            />
          ) : (
            <InsightsTab 
              prospectStatusCounts={prospectStatusCounts}
              responsesByDayOfWeek={responsesByDayOfWeek}
            />
          )}
        </div>
      </div>
    </div>
  );
}
