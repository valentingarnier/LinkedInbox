"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { MessageTemplate } from "@/lib/supabase/types";
import { Header, Logo } from "@/components/layout";

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
    <div className="relative overflow-hidden rounded-xl p-5 bg-white border border-zinc-100 hover:border-[#6039ed]/30 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        <span className="text-2xl">{getRankEmoji(rank)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h4 className="text-base font-semibold text-zinc-900">
              {template.label}
            </h4>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg ${getInterestColor(template.interest_rate || 0)}`}>
              {(template.interest_rate || 0).toFixed(0)}% interest
            </span>
          </div>
          
          {template.description && (
            <p className="text-sm text-zinc-600 mb-3">
              {template.description}
            </p>
          )}
          
          {template.pattern_example && (
            <div className="bg-zinc-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-zinc-400 mb-1">Pattern Example</p>
              <p className="text-sm text-zinc-600 italic">
                "{template.pattern_example}"
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Used:</span>
              <span className="font-semibold text-zinc-700">{template.conversation_count}x</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Response Rate:</span>
              <span className="font-semibold text-zinc-700">{(template.response_rate || 0).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Ghost Rate:</span>
              <span className="font-semibold text-zinc-700">{(template.ghost_rate || 0).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Avg Engagement:</span>
              <span className="font-semibold text-zinc-700">{(template.avg_engagement || 0).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interest rate bar */}
      <div className="mt-4">
        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6039ed] to-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (template.interest_rate || 0) * 2)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/templates", { credentials: "include" });
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
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
  }, [router]);

  // Calculate summary stats
  const topTemplate = templates[0];
  const avgInterestRate = templates.length > 0 
    ? templates.reduce((sum, t) => sum + (t.interest_rate || 0), 0) / templates.length 
    : 0;
  const totalConversations = templates.reduce((sum, t) => sum + (t.conversation_count || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Logo />
            </Link>
            <div className="h-6 w-px bg-zinc-200" />
            <nav className="flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-zinc-300">/</span>
              <span className="text-sm font-medium text-zinc-900">Templates</span>
            </nav>
          </div>
        </div>
      </Header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">
            Message Templates
          </h1>
          <p className="text-zinc-500">
            Analyze which opener patterns perform best in your cold outreach
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#6039ed]/30 border-t-[#6039ed] rounded-full animate-spin" />
              <p className="text-sm text-zinc-500">Loading templates...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <p className="text-sm text-red-500 mb-2">Failed to load templates</p>
              <p className="text-xs text-zinc-400">{error}</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-700 mb-2">No template patterns found</h3>
              <p className="text-sm text-zinc-500 mb-4">
                We need at least 3 similar openers to identify a template pattern. 
                Keep sending outreach and run another analysis!
              </p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#6039ed] hover:underline"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-zinc-100 rounded-xl p-4">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Templates Found</p>
                <p className="text-2xl font-bold text-zinc-900">{templates.length}</p>
                <p className="text-xs text-zinc-500 mt-1">Distinct patterns</p>
              </div>
              <div className="bg-[#6039ed] rounded-xl p-4 text-white">
                <p className="text-xs font-medium text-white/70 uppercase tracking-wide mb-1">Best Performer</p>
                <p className="text-2xl font-bold">{(topTemplate?.interest_rate || 0).toFixed(0)}%</p>
                <p className="text-xs text-white/60 mt-1 truncate">{topTemplate?.label || "—"}</p>
              </div>
              <div className="bg-white border border-zinc-100 rounded-xl p-4">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Total Conversations</p>
                <p className="text-2xl font-bold text-zinc-900">{totalConversations}</p>
                <p className="text-xs text-zinc-500 mt-1">Using these templates</p>
              </div>
            </div>

            {/* Template List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">
                  All Templates
                </h2>
                <span className="text-xs text-zinc-400">
                  Sorted by interest rate
                </span>
              </div>
              
              <div className="space-y-4">
                {templates.map((template, index) => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    rank={index + 1} 
                  />
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="mt-8 rounded-xl p-5 bg-[#6039ed]/5 border border-[#6039ed]/10">
              <div className="flex items-start gap-4">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="text-sm font-semibold text-zinc-700 mb-1">Pro tip</p>
                  <p className="text-sm text-zinc-600">
                    Templates with high response but low interest rates may be getting polite rejections. 
                    Focus on templates that convert responses into genuine interest or meetings.
                    Look for patterns with {">"} 20% interest rate as your baseline for success.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
