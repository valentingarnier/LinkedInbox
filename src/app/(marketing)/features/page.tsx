import Link from "next/link";

function FeatureHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6039ed]/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6039ed]/20 rounded-full blur-[120px]" />
      
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="text-sm text-zinc-400">Everything you need to understand your outreach</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight mb-6">
          Features built for
          <br />
          <span className="bg-gradient-to-r from-[#6039ed] via-purple-400 to-[#6039ed] bg-clip-text text-transparent">
            founder validation
          </span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Not another CRM. Not another automation tool. LinkedInbox is built specifically to help 
          founders understand if their cold outreach is actually validating their problem.
        </p>
      </div>
    </section>
  );
}

function FeatureSection({
  title,
  description,
  features,
  reversed = false,
  visual,
}: {
  title: string;
  description: string;
  features: { title: string; description: string }[];
  reversed?: boolean;
  visual: React.ReactNode;
}) {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? "lg:flex-row-reverse" : ""}`}>
          <div className={reversed ? "lg:order-2" : ""}>
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-zinc-400 mb-8">{description}</p>
            <div className="space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#6039ed]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-zinc-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={reversed ? "lg:order-1" : ""}>
            {visual}
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketPullVisual() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="absolute -top-3 left-6 px-3 py-1 bg-[#6039ed] rounded-full text-xs font-medium text-white">
        Your Score
      </div>
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-[#6039ed] to-[#4c2bc4] mb-4">
          <span className="text-4xl font-bold text-white">24.5%</span>
        </div>
        <p className="text-xl font-semibold text-white mb-2">Market Pull</p>
        <p className="text-sm text-zinc-400">Prospects who showed genuine interest</p>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">18</p>
          <p className="text-xs text-zinc-500">Interested</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-400">6</p>
          <p className="text-xs text-zinc-500">Meetings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-white">98</p>
          <p className="text-xs text-zinc-500">Total Cold</p>
        </div>
      </div>
    </div>
  );
}

function ProspectAnalysisVisual() {
  const statuses = [
    { label: "Interested", count: 18, color: "bg-green-500", percent: "18%" },
    { label: "Meeting Scheduled", count: 6, color: "bg-blue-500", percent: "6%" },
    { label: "Engaged", count: 24, color: "bg-yellow-500", percent: "25%" },
    { label: "No Response", count: 32, color: "bg-zinc-600", percent: "33%" },
    { label: "Ghosted", count: 12, color: "bg-orange-500", percent: "12%" },
    { label: "Not Interested", count: 6, color: "bg-red-500", percent: "6%" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-white">Prospect Breakdown</h4>
        <span className="text-sm text-zinc-500">98 conversations</span>
      </div>
      <div className="space-y-3">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-zinc-400">{status.label}</span>
                <span className="text-sm text-zinc-500">{status.count}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${status.color} rounded-full`} style={{ width: status.percent }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OutreachScoreVisual() {
  const criteria = [
    { label: "Personalization", score: 85 },
    { label: "Value Proposition", score: 72 },
    { label: "Call to Action", score: 68 },
    { label: "Tone & Voice", score: 91 },
    { label: "Brevity", score: 78 },
    { label: "Originality", score: 64 },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-semibold text-white">Outreach Quality Analysis</h4>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#6039ed]">78</span>
          <span className="text-sm text-zinc-500">/100</span>
        </div>
      </div>
      <div className="space-y-4">
        {criteria.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-zinc-400">{item.label}</span>
              <span className="text-sm font-medium text-white">{item.score}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  item.score >= 80 ? "bg-green-500" : 
                  item.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`} 
                style={{ width: `${item.score}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 rounded-xl bg-[#6039ed]/10 border border-[#6039ed]/20">
        <p className="text-sm text-zinc-300">
          <span className="text-[#6039ed] font-medium">AI Suggestion:</span> Your messages could be more original. 
          Try referencing specific details from the prospect&apos;s recent posts or achievements.
        </p>
      </div>
    </div>
  );
}

function FilteringVisual() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h4 className="font-semibold text-white mb-4">Conversation Types</h4>
      <div className="space-y-3">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#6039ed]/10 border border-[#6039ed]/20">
          <div className="w-10 h-10 rounded-full bg-[#6039ed]/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Cold Outreach</p>
            <p className="text-xs text-zinc-400">Messages you initiated to validate</p>
          </div>
          <span className="text-lg font-bold text-[#6039ed]">98</span>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-500">Personal</p>
            <p className="text-xs text-zinc-600">Friends, colleagues, misc</p>
          </div>
          <span className="text-lg font-bold text-zinc-600">423</span>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-500">Inbound</p>
            <p className="text-xs text-zinc-600">People who reached out to you</p>
          </div>
          <span className="text-lg font-bold text-zinc-600">156</span>
        </div>
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        AI automatically filters to show only your cold outreach conversations
      </p>
    </div>
  );
}

function AllFeaturesGrid() {
  const features = [
    {
      icon: "📤",
      title: "CSV Import",
      description: "Upload your LinkedIn export in seconds. No API connections or complex integrations needed.",
    },
    {
      icon: "🔒",
      title: "Privacy First",
      description: "Your data stays yours. We don't connect to LinkedIn or access your account.",
    },
    {
      icon: "⚡",
      title: "Instant Analysis",
      description: "AI processes hundreds of conversations in minutes, not hours.",
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Check your stats on the go with a fully responsive dashboard.",
    },
    {
      icon: "🔄",
      title: "Re-analyze Anytime",
      description: "Upload new exports and re-run analysis to track progress over time.",
    },
    {
      icon: "🎯",
      title: "Actionable Insights",
      description: "Not just metrics—specific suggestions to improve your outreach.",
    },
  ];

  return (
    <section className="py-24 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
          <p className="text-lg text-zinc-400">Built for simplicity, designed for insight.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/20 transition-all">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesCTA() {
  return (
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to see your real numbers?
        </h2>
        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
          Stop guessing if your outreach is working. Get the clarity you need to make better decisions.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#6039ed] hover:bg-[#4c2bc4] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#6039ed]/25"
        >
          Get Started Free
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <FeatureHero />
      
      <FeatureSection
        title="Market Pull Score"
        description="The metric that actually matters. Not vanity metrics—real signal about whether people want what you're building."
        features={[
          {
            title: "Genuine interest measurement",
            description: "Counts only prospects who expressed real interest or booked meetings.",
          },
          {
            title: "Filters out noise",
            description: "Excludes polite responses and non-committal replies from the calculation.",
          },
          {
            title: "Benchmark your progress",
            description: "Track how your Market Pull improves as you iterate on your messaging.",
          },
        ]}
        visual={<MarketPullVisual />}
      />

      <FeatureSection
        title="AI Prospect Analysis"
        description="Every conversation is analyzed and classified so you know exactly where each prospect stands."
        features={[
          {
            title: "Automatic classification",
            description: "Interested, engaged, ghosted, not interested—know at a glance.",
          },
          {
            title: "Confidence scoring",
            description: "AI provides confidence levels so you know which classifications are certain.",
          },
          {
            title: "Detailed reasoning",
            description: "Understand why each prospect was classified the way they were.",
          },
        ]}
        reversed
        visual={<ProspectAnalysisVisual />}
      />

      <FeatureSection
        title="Outreach Quality Score"
        description="Get AI-powered feedback on your messaging quality across multiple dimensions."
        features={[
          {
            title: "Multi-factor scoring",
            description: "Personalization, value prop, tone, brevity, CTA, and originality.",
          },
          {
            title: "Specific suggestions",
            description: "Not just scores—actionable feedback to improve your messages.",
          },
          {
            title: "Learn what works",
            description: "Compare scores across conversations to see which approaches perform best.",
          },
        ]}
        visual={<OutreachScoreVisual />}
      />

      <FeatureSection
        title="Smart Filtering"
        description="AI automatically identifies and filters your cold outreach from everything else in your inbox."
        features={[
          {
            title: "Cold outreach detection",
            description: "Only analyze conversations where you initiated contact for business purposes.",
          },
          {
            title: "Excludes personal chats",
            description: "Friends, colleagues, and casual conversations are filtered out.",
          },
          {
            title: "Focus on what matters",
            description: "See only the conversations relevant to validating your idea.",
          },
        ]}
        reversed
        visual={<FilteringVisual />}
      />

      <AllFeaturesGrid />
      <FeaturesCTA />
    </>
  );
}
