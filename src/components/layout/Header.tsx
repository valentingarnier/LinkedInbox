"use client";

import { ReactNode } from "react";

interface HeaderProps {
  children: ReactNode;
  variant?: "full" | "centered";
}

export function Header({ children, variant = "full" }: HeaderProps) {
  return (
    <header className="border-b border-zinc-100 px-6 py-3 flex-shrink-0">
      <div className={variant === "centered" ? "max-w-4xl mx-auto" : ""}>
        {children}
      </div>
    </header>
  );
}

export function Logo({ size = "default" }: { size?: "default" | "large" }) {
  const iconSize = size === "large" ? 28 : 22;
  const textSize = size === "large" ? "text-xl" : "text-base";

  return (
    <div className="flex items-center gap-2">
      {/* Minimalist inbox icon */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 24 24" 
        fill="none"
        className="flex-shrink-0"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#6039ed" strokeWidth="1.5" fill="none"/>
        <path d="M2 8.5L12 14L22 8.5" stroke="#6039ed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="19" cy="8" r="2" fill="#6039ed"/>
      </svg>
      {/* Wordmark */}
      <span className={`font-semibold tracking-tight ${textSize}`}>
        <span className="text-zinc-900">Linked</span>
        <span className="text-[#6039ed]">Inbox</span>
      </span>
    </div>
  );
}
