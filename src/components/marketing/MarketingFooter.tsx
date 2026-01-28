import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#6039ed" strokeWidth="1.5" fill="none"/>
                <path d="M2 8.5L12 14L22 8.5" stroke="#6039ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="8" r="2" fill="#6039ed"/>
              </svg>
              <span className="font-semibold text-white">
                Linked<span className="text-[#6039ed]">Inbox</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">
              Turn your LinkedIn outreach into actionable insights. 
              Know what&apos;s working and what isn&apos;t.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/signup" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="mailto:hello@linkedinbox.co" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold text-white mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs md:text-sm text-zinc-500 hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-zinc-600 text-center md:text-left">
            © {new Date().getFullYear()} LinkedInbox. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-zinc-600 text-center md:text-right">
            Cold outreach analytics that tell the truth.
          </p>
        </div>
      </div>
    </footer>
  );
}
