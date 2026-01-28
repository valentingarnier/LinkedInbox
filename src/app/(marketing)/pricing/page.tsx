import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for testing the waters with your first outreach campaigns.",
    features: [
      "Up to 50 conversations",
      "Market Pull Score",
      "Basic prospect classification",
      "Cold outreach filtering",
      "1 re-analysis per month",
    ],
    notIncluded: [
      "Template performance analysis",
      "Outreach quality scoring",
      "AI suggestions",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For professionals serious about optimizing their cold outreach.",
    features: [
      "Unlimited conversations",
      "Market Pull Score",
      "Full prospect analysis",
      "Cold outreach filtering",
      "Unlimited re-analysis",
      "Template performance analysis",
      "Outreach quality scoring",
      "AI-powered suggestions",
      "Response time analytics",
      "Export reports",
    ],
    notIncluded: [],
    cta: "Start Pro Trial",
    href: "/signup",
    highlighted: true,
    badge: "Most Popular",
  },
];

function PricingHero() {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6039ed]/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#6039ed]/15 rounded-full blur-[120px]" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6">
          <span className="text-xs sm:text-sm text-zinc-400">Simple, transparent pricing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4 md:mb-6">
          Start free.
          <br />
          <span className="bg-gradient-to-r from-[#6039ed] via-purple-400 to-[#6039ed] bg-clip-text text-transparent">
            Scale when ready.
          </span>
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto">
          No credit card required to start. Upgrade when you need unlimited analysis 
          and advanced insights.
        </p>
      </div>
    </section>
  );
}

function PricingCard({
  plan,
}: {
  plan: (typeof PLANS)[number];
}) {
  return (
    <div
      className={`relative rounded-xl md:rounded-2xl p-5 md:p-8 ${
        plan.highlighted
          ? "bg-gradient-to-b from-[#6039ed]/20 to-[#6039ed]/5 border-2 border-[#6039ed]/50"
          : "bg-white/[0.02] border border-white/10"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-2.5 md:-top-3 left-1/2 -translate-x-1/2 px-3 md:px-4 py-0.5 md:py-1 bg-[#6039ed] rounded-full text-[10px] md:text-xs font-semibold text-white whitespace-nowrap">
          {plan.badge}
        </div>
      )}
      
      <div className="mb-5 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
          {plan.period && <span className="text-zinc-500 text-sm md:text-base">{plan.period}</span>}
        </div>
        <p className="text-xs md:text-sm text-zinc-400">{plan.description}</p>
      </div>

      <Link
        href={plan.href}
        className={`block w-full py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium text-center transition-all mb-6 md:mb-8 text-sm md:text-base ${
          plan.highlighted
            ? "bg-[#6039ed] hover:bg-[#4c2bc4] text-white hover:shadow-lg hover:shadow-[#6039ed]/25"
            : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        }`}
      >
        {plan.cta}
      </Link>

      <div className="space-y-3 md:space-y-4">
        <p className="text-[10px] md:text-xs font-medium text-zinc-500 uppercase tracking-wider">What&apos;s included</p>
        <ul className="space-y-2.5 md:space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 md:gap-3">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-[#6039ed] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs md:text-sm text-zinc-300">{feature}</span>
            </li>
          ))}
          {plan.notIncluded.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 md:gap-3 opacity-50">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-zinc-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-xs md:text-sm text-zinc-500">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PricingGrid() {
  return (
    <section className="py-8 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      question: "How do I export my LinkedIn messages?",
      answer: "Go to LinkedIn Settings > Data Privacy > Get a copy of your data > Select 'Messages' > Request archive. You'll receive a download link within 24 hours (usually much faster).",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. Your data is encrypted in transit and at rest. We don't connect to LinkedIn or access your account—we only process the CSV you upload. You can delete your data anytime.",
    },
    {
      question: "What's the difference between response rate and Market Pull?",
      answer: "Response rate is a vanity metric—it includes everyone who replied, even if they said 'not interested.' Market Pull only counts prospects who showed genuine interest or booked a meeting.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. No questions asked, no hidden fees. Your data remains available until the end of your billing period.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. If LinkedInbox isn't right for you, just reach out and we'll refund your payment.",
    },
    {
      question: "How does template analysis work?",
      answer: "Our AI clusters your messages by approach style (e.g., 'Compliment + Question' vs 'Direct Value Prop') and calculates the interest rate for each template type. This shows you exactly which approaches resonate best.",
    },
  ];

  return (
    <section className="py-12 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 md:mb-4">Frequently asked questions</h2>
          <p className="text-zinc-400 text-sm md:text-base">Everything you need to know about LinkedInbox.</p>
        </div>
        <div className="space-y-4 md:space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 p-4 md:p-6">
              <h3 className="font-semibold text-white mb-2 text-sm md:text-base">{faq.question}</h3>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCTA() {
  return (
    <section className="py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6039ed] to-[#4c2bc4]" />
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
          
          <div className="relative px-6 py-10 sm:px-12 md:px-16 md:py-16 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Still have questions?
            </h2>
            <p className="text-sm md:text-lg text-white/80 mb-6 md:mb-8 max-w-xl mx-auto">
              We&apos;re here to help. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <a
              href="mailto:hello@linkedinbox.co"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 md:py-4 bg-white text-[#6039ed] font-semibold rounded-xl hover:bg-white/90 transition-all text-sm md:text-base"
            >
              Contact Us
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingGrid />
      <FAQ />
      <PricingCTA />
    </>
  );
}
