"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#6039ed" strokeWidth="1.5" fill="none"/>
        <path d="M2 8.5L12 14L22 8.5" stroke="#6039ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="19" cy="8" r="2" fill="#6039ed"/>
      </svg>
      <span className="text-lg font-semibold tracking-tight">
        <span className="text-white">Linked</span>
        <span className="text-[#6039ed]">Inbox</span>
      </span>
    </Link>
  );
}

export function MarketingNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-white bg-[#6039ed] hover:bg-[#4c2bc4] px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-[#6039ed]/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-white bg-white/5"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/5 mt-2 pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-400 hover:text-white px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-medium text-white bg-[#6039ed] hover:bg-[#4c2bc4] px-4 py-2.5 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
