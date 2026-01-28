import Link from "next/link";

// Custom illustration components
function ChartIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="28" width="8" height="16" rx="2" fill="currentColor" fillOpacity="0.3"/>
      <rect x="14" y="20" width="8" height="24" rx="2" fill="currentColor" fillOpacity="0.5"/>
      <rect x="24" y="12" width="8" height="32" rx="2" fill="currentColor" fillOpacity="0.7"/>
      <rect x="34" y="4" width="8" height="40" rx="2" fill="currentColor"/>
    </svg>
  );
}

function TargetIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
      <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4"/>
      <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6"/>
      <circle cx="24" cy="24" r="3" fill="currentColor"/>
    </svg>
  );
}

function MessageIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="8" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 16h20M8 22h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <rect x="12" y="20" width="32" height="24" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 28h20M16 34h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function BrainIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 8C16 8 10 14 10 22c0 4 2 8 5 10v8h18v-8c3-2 5-6 5-10 0-8-6-14-14-14z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <path d="M18 40h12M20 44h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="18" cy="20" r="2" fill="currentColor"/>
      <circle cx="30" cy="20" r="2" fill="currentColor"/>
      <path d="M20 28c2 2 6 2 8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function TemplateIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <rect x="10" y="10" width="12" height="8" rx="2" fill="currentColor" fillOpacity="0.3"/>
      <rect x="10" y="22" width="28" height="3" rx="1.5" fill="currentColor" fillOpacity="0.5"/>
      <rect x="10" y="28" width="24" height="3" rx="1.5" fill="currentColor" fillOpacity="0.4"/>
      <rect x="10" y="34" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.3"/>
      <circle cx="34" cy="14" r="6" fill="currentColor"/>
      <path d="M32 14l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TimeIllustration({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
      <path d="M24 12v12l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="24" cy="24" r="2" fill="currentColor"/>
    </svg>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6039ed]/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[400px] md:h-[600px] bg-[#6039ed]/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 mb-6 sm:mb-8">
            <span className="w-2 h-2 rounded-full bg-[#6039ed] animate-pulse" />
            <span className="text-xs sm:text-sm text-zinc-400">Cold outreach analytics that tell the truth</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-7">
            Is your Linkedin cold outreach <span className="bg-gradient-to-r from-[#6039ed] via-purple-400 to-[#6039ed] bg-clip-text text-transparent">actually working?</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Import your LinkedIn messages and discover which templates get responses, 
            which prospects are genuinely interested, and what&apos;s resonating with your market.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#6039ed] hover:bg-[#4c2bc4] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#6039ed]/25 hover:scale-[1.02] text-center"
            >
              Analyze My Outreach
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all text-center"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your data stays private</span>
            </div>
          </div>
        </div>

        {/* Hero illustration - Dashboard preview */}
        <div className="mt-12 md:mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 md:p-2 shadow-2xl overflow-hidden">
            <div className="rounded-lg md:rounded-xl bg-[#111] overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] md:text-xs text-zinc-600">linkedinbox.co/dashboard</span>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-3 md:p-6">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-[#6039ed] rounded-lg md:rounded-xl p-3 md:p-4">
                    <p className="text-[10px] md:text-xs text-white/60 mb-0.5 md:mb-1">MARKET PULL</p>
                    <p className="text-lg md:text-2xl font-bold text-white">24.5%</p>
                    <p className="text-[10px] md:text-xs text-white/50 hidden sm:block">Genuine interest</p>
                  </div>
                  <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5">
                    <p className="text-[10px] md:text-xs text-zinc-500 mb-0.5 md:mb-1">RESPONSE RATE</p>
                    <p className="text-lg md:text-2xl font-bold text-white">67.2%</p>
                    <p className="text-[10px] md:text-xs text-zinc-500 hidden sm:block">Replied</p>
                  </div>
                  <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5">
                    <p className="text-[10px] md:text-xs text-zinc-500 mb-0.5 md:mb-1">TOP TEMPLATE</p>
                    <p className="text-lg md:text-2xl font-bold text-green-400">32%</p>
                    <p className="text-[10px] md:text-xs text-zinc-500 hidden sm:block">Interest rate</p>
                  </div>
                  <div className="bg-white/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-white/5">
                    <p className="text-[10px] md:text-xs text-zinc-500 mb-0.5 md:mb-1">OUTREACH SCORE</p>
                    <p className="text-lg md:text-2xl font-bold text-white">78<span className="text-xs md:text-sm text-zinc-500">/100</span></p>
                    <p className="text-[10px] md:text-xs text-zinc-500 hidden sm:block">Quality</p>
                  </div>
                </div>
                {/* Fake conversation list - hidden on small screens */}
                <div className="hidden md:flex gap-4">
                  <div className="w-1/3 space-y-2">
                    {["Interested", "Meeting", "Engaged", "Ghosted"].map((status, i) => (
                      <div key={status} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Prospect {i + 1}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            status === "Interested" ? "bg-green-500/20 text-green-400" :
                            status === "Meeting" ? "bg-blue-500/20 text-blue-400" :
                            status === "Engaged" ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-zinc-500/20 text-zinc-400"
                          }`}>{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 bg-white/5 rounded-lg p-4 border border-white/5">
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6039ed]/20" />
                        <div className="flex-1 bg-white/5 rounded-lg p-3 text-sm text-zinc-400">
                          Hey! I noticed your work on B2B SaaS analytics...
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <div className="flex-1 max-w-[80%] bg-[#6039ed]/20 rounded-lg p-3 text-sm text-zinc-300">
                          Thanks for reaching out! This sounds interesting...
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-700" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PainPointsSection() {
  const painPoints = [
    {
      icon: <TargetIllustration className="w-6 h-6 text-[#6039ed]" />,
      title: "You can't tell what's working",
      description: "You've sent hundreds of messages but have no idea which templates or approaches actually generate interest.",
    },
    {
      icon: <MessageIllustration className="w-6 h-6 text-[#6039ed]" />,
      title: "Response rate is misleading",
      description: "Someone replying \"not interested\" counts as a response. You need to know who's genuinely interested.",
    },
    {
      icon: <TimeIllustration className="w-6 h-6 text-[#6039ed]" />,
      title: "Hours spent with no clarity",
      description: "Cold outreach takes time. Without real data on what resonates, you're iterating blind.",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            LinkedIn doesn&apos;t give you the data you need
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Connections and views don&apos;t tell you if your message resonated. You need real signal.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group relative p-6 md:p-8 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/30 transition-all hover:bg-white/[0.04]"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-[#6039ed]/10 flex items-center justify-center mb-4 md:mb-6">
                {point.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-white">{point.title}</h3>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TemplatesSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6039ed]/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6039ed]/10 border border-[#6039ed]/20 mb-4 md:mb-6">
              <span className="text-xs sm:text-sm text-[#6039ed] font-medium">Most powerful feature</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Discover which templates
              <br />
              <span className="text-[#6039ed]">actually perform</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-400 mb-6 md:mb-8 leading-relaxed">
              AI clusters your messages by approach style and shows you exactly which 
              opener types get the best results. Stop guessing which templates work.
            </p>
            <div className="space-y-3 md:space-y-4">
              {[
                { label: "Pattern detection", desc: "AI identifies similar message styles automatically" },
                { label: "Performance ranking", desc: "See which approaches get genuine interest" },
                { label: "Actionable insights", desc: "Know exactly what to double down on" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-lg bg-[#6039ed]/10 flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm md:text-base">{item.label}</p>
                    <p className="text-xs md:text-sm text-zinc-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h4 className="font-semibold text-white text-sm md:text-base">Top Performing Templates</h4>
              <span className="text-xs md:text-sm text-zinc-500">By interest rate</span>
            </div>
            <div className="space-y-3 md:space-y-4">
              {[
                { rank: 1, name: "Compliment + Specific Ask", rate: 32, uses: 24, color: "from-[#6039ed] to-purple-400" },
                { rank: 2, name: "Mutual Connection Intro", rate: 28, uses: 18, color: "from-[#6039ed]/80 to-purple-400/80" },
                { rank: 3, name: "Direct Value Proposition", rate: 21, uses: 45, color: "from-[#6039ed]/60 to-purple-400/60" },
              ].map((template) => (
                <div key={template.rank} className="p-3 md:p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-white font-bold text-sm md:text-base`}>
                      {template.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm md:text-base truncate">{template.name}</p>
                      <p className="text-xs md:text-sm text-zinc-500">{template.uses} conversations</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg md:text-xl font-bold text-green-400">{template.rate}%</p>
                      <p className="text-[10px] md:text-xs text-zinc-500">interest</p>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${template.color}`} 
                      style={{ width: `${template.rate * 2.5}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const features = [
    {
      icon: <ChartIllustration className="w-8 h-8 md:w-10 md:h-10 text-[#6039ed]" />,
      title: "Market Pull Score",
      description: "The metric that matters: what percentage of prospects are genuinely interested or booked a meeting. Not vanity metrics—real signal.",
    },
    {
      icon: <BrainIllustration className="w-8 h-8 md:w-10 md:h-10 text-[#6039ed]" />,
      title: "AI Prospect Analysis",
      description: "Every conversation classified: interested, engaged, ghosted, not interested. Know exactly where each prospect stands.",
    },
    {
      icon: <TargetIllustration className="w-8 h-8 md:w-10 md:h-10 text-[#6039ed]" />,
      title: "Outreach Quality Score",
      description: "AI scores your messages on personalization, value prop, tone, and more. See what's working and what's not.",
    },
    {
      icon: <TimeIllustration className="w-8 h-8 md:w-10 md:h-10 text-[#6039ed]" />,
      title: "Best Time to Reach",
      description: "See which days get the most responses so you can optimize your outreach timing.",
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#6039ed]/10 border border-[#6039ed]/20 mb-4 md:mb-6">
            <span className="text-xs sm:text-sm text-[#6039ed] font-medium">Complete analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Everything you need to optimize
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            Import your LinkedIn messages. Get the truth about your cold outreach in minutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative p-6 md:p-8 rounded-xl md:rounded-2xl bg-[#111] border border-white/5 hover:border-[#6039ed]/20 transition-all group"
            >
              <div className="mb-3 md:mb-4">{feature.icon}</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-white group-hover:text-[#6039ed] transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Export your LinkedIn messages",
      description: "Download your messaging data from LinkedIn settings. Takes 2 minutes.",
    },
    {
      step: "02",
      title: "Upload to LinkedInbox",
      description: "Drag and drop your CSV. We parse and organize every conversation.",
    },
    {
      step: "03",
      title: "Get AI-powered insights",
      description: "Our AI analyzes each conversation, classifies prospects, and scores your outreach.",
    },
    {
      step: "04",
      title: "Optimize your approach",
      description: "See which templates work, who's interested, and what to improve.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            From inbox chaos to clarity in minutes
          </h2>
          <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
            No complicated setup. No integrations. Just upload and get insights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#6039ed]/50 to-transparent z-0" />
              )}
              <div className="relative p-5 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/20 transition-all h-full">
                <div className="text-[#6039ed] font-mono text-xs md:text-sm mb-3 md:mb-4">{step.step}</div>
                <h3 className="text-base md:text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6039ed] to-[#4c2bc4]" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative px-6 py-12 sm:px-12 md:px-16 md:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-xl mx-auto">
              Get real insights on which messages resonate and which prospects 
              are worth your time.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#6039ed] font-semibold rounded-xl hover:bg-white/90 transition-all hover:scale-[1.02]"
            >
              Analyze My Outreach Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PainPointsSection />
      <TemplatesSection />
      <SolutionSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
