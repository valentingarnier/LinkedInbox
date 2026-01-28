import Link from "next/link";

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6039ed]/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#6039ed]/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#6039ed] animate-pulse" />
            <span className="text-sm text-zinc-400">For founders validating through cold outreach</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            You&apos;ve sent 500 messages.
            <br />
            <span className="bg-gradient-to-r from-[#6039ed] via-purple-400 to-[#6039ed] bg-clip-text text-transparent">
              Do you know if anyone cares?
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            LinkedIn doesn&apos;t tell you what matters. Response rate means nothing if 90% say &quot;not interested.&quot; 
            Import your messages and discover your real <span className="text-white font-medium">market pull</span>—whether 
            people actually want what you&apos;re building.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-[#6039ed] hover:bg-[#4c2bc4] text-white font-semibold rounded-xl transition-all hover:shadow-xl hover:shadow-[#6039ed]/25 hover:scale-[1.02]"
            >
              Analyze My Outreach →
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
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
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-2 shadow-2xl">
            <div className="rounded-xl bg-[#111] overflow-hidden">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-zinc-600">linkedinbox.app/dashboard</span>
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-[#6039ed] rounded-xl p-4">
                    <p className="text-xs text-white/60 mb-1">MARKET PULL</p>
                    <p className="text-2xl font-bold text-white">24.5%</p>
                    <p className="text-xs text-white/50">Interested + meetings</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">RESPONSE RATE</p>
                    <p className="text-2xl font-bold text-white">67.2%</p>
                    <p className="text-xs text-zinc-500">Prospects who replied</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">ENGAGEMENT</p>
                    <p className="text-2xl font-bold text-white">45.8%</p>
                    <p className="text-xs text-zinc-500">Conversation balance</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1">OUTREACH SCORE</p>
                    <p className="text-2xl font-bold text-white">78<span className="text-sm text-zinc-500">/100</span></p>
                    <p className="text-xs text-zinc-500">Message quality</p>
                  </div>
                </div>
                {/* Fake conversation list */}
                <div className="flex gap-4">
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "\"Did anyone actually want this?\"",
      description: "You've messaged hundreds of people. LinkedIn shows connections and views, but not whether your value prop landed or fell flat.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "\"What should I change?\"",
      description: "You're iterating blind. No idea which messages work, which fall flat, or why some prospects ghost you after the first reply.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "\"Am I wasting my time?\"",
      description: "Cold outreach takes hours. Without real data on market interest, you might be validating the wrong problem entirely.",
    },
  ];

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The questions that keep founders up at night
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            You&apos;re doing the work. But LinkedIn&apos;s inbox is a black hole—no insights, no clarity, no signal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/30 transition-all hover:bg-white/[0.04]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6039ed]/10 flex items-center justify-center text-[#6039ed] mb-6">
                {point.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{point.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  const features = [
    {
      title: "Market Pull Score",
      description: "The only metric that matters: what percentage of prospects are genuinely interested or booked a meeting. Not vanity metrics—real signal.",
      icon: "📊",
    },
    {
      title: "AI Prospect Analysis",
      description: "Every conversation classified: interested, engaged, ghosted, not interested. Know exactly where each prospect stands.",
      icon: "🤖",
    },
    {
      title: "Outreach Quality Score",
      description: "AI scores your messages on personalization, value prop, tone, and more. See what's working and what's not.",
      icon: "✨",
    },
    {
      title: "Response Patterns",
      description: "Understand when prospects respond, how engaged they are, and who's worth following up with.",
      icon: "📈",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#6039ed]/5 to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6039ed]/10 border border-[#6039ed]/20 mb-6">
            <span className="text-sm text-[#6039ed] font-medium">The Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Finally know if your outreach is working
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Import your LinkedIn messages. Get the truth about your cold outreach in minutes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="relative p-8 rounded-2xl bg-[#111] border border-white/5 hover:border-[#6039ed]/20 transition-all group"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-[#6039ed] transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
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
      title: "Know the truth",
      description: "See your Market Pull Score and understand if people actually want what you're building.",
    },
  ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            From inbox chaos to clarity in minutes
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            No complicated setup. No integrations. Just upload and get insights.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#6039ed]/50 to-transparent z-0" />
              )}
              <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#6039ed]/20 transition-all h-full">
                <div className="text-[#6039ed] font-mono text-sm mb-4">{step.step}</div>
                <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{step.description}</p>
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
    <section className="py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6039ed] to-[#4c2bc4]" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative px-8 py-16 sm:px-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stop guessing. Start knowing.
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Your next pivot, feature, or fundraise depends on real market signal. 
              Get it from the conversations you&apos;re already having.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#6039ed] font-semibold rounded-xl hover:bg-white/90 transition-all hover:scale-[1.02]"
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
      <SolutionSection />
      <HowItWorksSection />
      <CTASection />
    </>
  );
}
