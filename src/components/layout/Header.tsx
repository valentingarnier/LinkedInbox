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

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <span className="font-semibold text-zinc-900">LinkedInbox</span>
    </div>
  );
}
