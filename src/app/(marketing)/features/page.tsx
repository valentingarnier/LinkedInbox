import Link from "next/link";

// Custom illustration components
function ChartIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="currentColor" fillOpacity="0.5"/>
      <rect x="10" y="10" width="4" height="11" rx="1" fill="currentColor" fillOpacity="0.7"/>
      <rect x="17" y="5" width="4" height="16" rx="1" fill="currentColor"/>
    </svg>
  );
}

function TemplateIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <rect x="5" y="5" width="6" height="4" rx="1" fill="currentColor" fillOpacity="0.3"/>
      <rect x="5" y="11" width="14" height="2" rx="1" fill="currentColor"/>
      <rect x="5" y="15" width="10" height="2" rx="1" fill="currentColor" fillOpacity="0.6"/>
    </svg>
  );
}

function BrainIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4C8 4 5 7 5 11c0 2 1 4 2.5 5v4h9v-4c1.5-1 2.5-3 2.5-5 0-4-3-7-7-7z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <path d="M9 20h6M10 22h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="10" r="1" fill="currentColor"/>
      <circle cx="15" cy="10" r="1" fill="currentColor"/>
    </svg>
  );
}

function FilterIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4h18l-7 8v7l-4 2v-9L3 4z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
    </svg>
  );
}

function UploadIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function BoltIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round"/>
    </svg>
  );
}

function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TargetIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function MobileIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="12" height="20" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <circle cx="12" cy="18" r="1" fill="currentColor"/>
      <path d="M9 5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function FeatureHero() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6039ed]/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#6039ed]/20 rounded-full blur-[120px]" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6">
          <span className="text-xs sm:text-sm text-zinc-400">Everything you need to optimize your outreach</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 md:mb-6">
          Features built for
          <br />
          <span className="bg-gradient-to-r from-[#6039ed] via-purple-400 to-[#6039ed] bg-clip-text text-transparent">
            cold outreach success
          </span>
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
          Not another CRM. Not another automation tool. LinkedInbox helps you understand 
          what&apos;s working in your cold outreach and what needs to change.
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
    <section className="py-12 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-20 items-center`}>
          <div className={reversed ? "lg:order-2" : ""}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">{title}</h2>
            <p className="text-base md:text-lg text-zinc-400 mb-6 md:mb-8">{description}</p>
            <div className="space-y-4 md:space-y-6">
              {features.map((feature, i) => (
                <div key={i} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#6039ed]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-0.5 md:mb-1 text-sm md:text-base">{feature.title}</h3>
                    <p className="text-xs md:text-sm text-zinc-400">{feature.description}</p>
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

function TemplatesVisual() {
  return (
    <div className="relative rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
      <div className="absolute -top-2.5 md:-top-3 left-4 md:left-6 px-2.5 md:px-3 py-0.5 md:py-1 bg-[#6039ed] rounded-full text-[10px] md:text-xs font-medium text-white">
        AI-Powered
      </div>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h4 className="font-semibold text-white text-sm md:text-base">Template Performance</h4>
        <span className="text-[10px] md:text-xs text-zinc-500">8 patterns found</span>
      </div>
      <div className="space-y-3">
        {[
          { name: "Compliment + Question", rate: 34, uses: 28, medal: "gold" },
          { name: "Mutual Interest Hook", rate: 27, uses: 22, medal: "silver" },
          { name: "Direct Value Prop", rate: 19, uses: 41, medal: "bronze" },
        ].map((template, i) => (
          <div key={i} className="p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-base ${
                  template.medal === "gold" ? "bg-yellow-500/20 text-yellow-400" :
                  template.medal === "silver" ? "bg-zinc-400/20 text-zinc-300" :
                  "bg-orange-500/20 text-orange-400"
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs md:text-sm text-white font-medium">{template.name}</span>
              </div>
              <span className="text-base md:text-lg font-bold text-green-400">{template.rate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6039ed] to-purple-400 rounded-full" style={{ width: `${template.rate * 2.5}%` }} />
              </div>
              <span className="text-[10px] md:text-xs text-zinc-500">{template.uses} uses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketPullVisual() {
  return (
    <div className="relative rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
      <div className="absolute -top-2.5 md:-top-3 left-4 md:left-6 px-2.5 md:px-3 py-0.5 md:py-1 bg-[#6039ed] rounded-full text-[10px] md:text-xs font-medium text-white">
        Your Score
      </div>
      <div className="text-center py-6 md:py-8">
        <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#6039ed] to-[#4c2bc4] mb-3 md:mb-4">
          <span className="text-3xl md:text-4xl font-bold text-white">24.5%</span>
        </div>
        <p className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2">Market Pull</p>
        <p className="text-xs md:text-sm text-zinc-400">Prospects who showed genuine interest</p>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-4 pt-4 md:pt-6 border-t border-white/5">
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold text-green-400">18</p>
          <p className="text-[10px] md:text-xs text-zinc-500">Interested</p>
        </div>
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold text-blue-400">6</p>
          <p className="text-[10px] md:text-xs text-zinc-500">Meetings</p>
        </div>
        <div className="text-center">
          <p className="text-xl md:text-2xl font-bold text-white">98</p>
          <p className="text-[10px] md:text-xs text-zinc-500">Total</p>
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
    <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h4 className="font-semibold text-white text-sm md:text-base">Prospect Breakdown</h4>
        <span className="text-[10px] md:text-sm text-zinc-500">98 conversations</span>
      </div>
      <div className="space-y-2.5 md:space-y-3">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-3 md:gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs md:text-sm text-zinc-400">{status.label}</span>
                <span className="text-xs md:text-sm text-zinc-500">{status.count}</span>
              </div>
              <div className="h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
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
    <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h4 className="font-semibold text-white text-sm md:text-base">Outreach Quality</h4>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-xl md:text-2xl font-bold text-[#6039ed]">78</span>
          <span className="text-xs md:text-sm text-zinc-500">/100</span>
        </div>
      </div>
      <div className="space-y-3 md:space-y-4">
        {criteria.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs md:text-sm text-zinc-400">{item.label}</span>
              <span className="text-xs md:text-sm font-medium text-white">{item.score}</span>
            </div>
            <div className="h-1 md:h-1.5 bg-white/5 rounded-full overflow-hidden">
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
      <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-[#6039ed]/10 border border-[#6039ed]/20">
        <p className="text-xs md:text-sm text-zinc-300">
          <span className="text-[#6039ed] font-medium">Suggestion:</span> Your messages could be more original. 
          Try referencing specific details from the prospect&apos;s recent posts.
        </p>
      </div>
    </div>
  );
}

function FilteringVisual() {
  return (
    <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
      <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Conversation Types</h4>
      <div className="space-y-2.5 md:space-y-3">
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-[#6039ed]/10 border border-[#6039ed]/20">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#6039ed]/20 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-white">Cold Outreach</p>
            <p className="text-[10px] md:text-xs text-zinc-400">Messages you initiated</p>
          </div>
          <span className="text-base md:text-lg font-bold text-[#6039ed]">98</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/5 opacity-50">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-zinc-500">Personal</p>
            <p className="text-[10px] md:text-xs text-zinc-600">Friends, colleagues</p>
          </div>
          <span className="text-base md:text-lg font-bold text-zinc-600">423</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-white/5 border border-white/5 opacity-50">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-zinc-500">Inbound</p>
            <p className="text-[10px] md:text-xs text-zinc-600">People who reached out</p>
          </div>
          <span className="text-base md:text-lg font-bold text-zinc-600">156</span>
        </div>
      </div>
      <p className="mt-3 md:mt-4 text-[10px] md:text-xs text-zinc-500">
        AI automatically filters to show only your cold outreach conversations
      </p>
    </div>
  );
}

function AllFeaturesGrid() {
  const features = [
    {
      icon: <UploadIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "CSV Import",
      description: "Upload your LinkedIn export in seconds. No API connections needed.",
    },
    {
      icon: <LockIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "Privacy First",
      description: "Your data stays yours. We don't connect to LinkedIn.",
    },
    {
      icon: <BoltIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "Instant Analysis",
      description: "AI processes hundreds of conversations in minutes.",
    },
    {
      icon: <MobileIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "Mobile Friendly",
      description: "Check your stats on the go with a responsive dashboard.",
    },
    {
      icon: <RefreshIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "Re-analyze Anytime",
      description: "Upload new exports to track your progress over time.",
    },
    {
      icon: <TargetIcon className="w-6 h-6 md:w-7 md:h-7 text-[#6039ed]" />,
      title: "Actionable Insights",
      description: "Not just metrics—specific suggestions to improve.",
    },
  ];

  return (
    <section className="py-12 md:py-24 bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Everything you need</h2>
          <p className="text-base md:text-lg text-zinc-400">Built for simplicity, designed for insight.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {features.map((feature, i) => (
            <div key={i} className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/20 transition-all">
              <div className="mb-3 md:mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1.5 md:mb-2 text-sm md:text-base">{feature.title}</h3>
              <p className="text-xs md:text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesCTA() {
  return (
    <section className="py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
          Ready to see your real numbers?
        </h2>
        <p className="text-base md:text-lg text-zinc-400 mb-6 md:mb-8 max-w-xl mx-auto">
          Stop guessing if your outreach is working. Get the clarity you need to optimize.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#6039ed] hover:bg-[#4c2bc4] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#6039ed]/25"
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
        title="Template Performance Analysis"
        description="The most powerful feature. AI clusters your messages by approach style and shows you exactly which openers get the best results."
        features={[
          {
            title: "Automatic pattern detection",
            description: "AI identifies similar message styles without any manual tagging.",
          },
          {
            title: "Performance ranking",
            description: "See which templates drive genuine interest, not just replies.",
          },
          {
            title: "Actionable insights",
            description: "Know exactly which approaches to double down on.",
          },
        ]}
        visual={<TemplatesVisual />}
      />

      <FeatureSection
        title="Market Pull Score"
        description="The metric that actually matters. Not vanity metrics—real signal about whether your message resonates."
        features={[
          {
            title: "Genuine interest measurement",
            description: "Counts only prospects who expressed real interest or booked meetings.",
          },
          {
            title: "Filters out noise",
            description: "Excludes polite responses and non-committal replies.",
          },
          {
            title: "Benchmark your progress",
            description: "Track how your Market Pull improves as you iterate.",
          },
        ]}
        reversed
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
            description: "AI provides confidence levels for each classification.",
          },
          {
            title: "Detailed reasoning",
            description: "Understand why each prospect was classified the way they were.",
          },
        ]}
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
            description: "Compare scores across conversations to see patterns.",
          },
        ]}
        reversed
        visual={<OutreachScoreVisual />}
      />

      <FeatureSection
        title="Smart Filtering"
        description="AI automatically identifies and filters your cold outreach from everything else in your inbox."
        features={[
          {
            title: "Cold outreach detection",
            description: "Only analyze conversations where you initiated contact.",
          },
          {
            title: "Excludes personal chats",
            description: "Friends, colleagues, and casual conversations are filtered out.",
          },
          {
            title: "Focus on what matters",
            description: "See only the conversations relevant to your outreach.",
          },
        ]}
        visual={<FilteringVisual />}
      />

      <AllFeaturesGrid />
      <FeaturesCTA />
    </>
  );
}
