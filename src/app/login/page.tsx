"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleOAuthLogin = async (provider: "google" | "azure") => {
    setIsLoading(provider);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => handleOAuthLogin("google")}
        disabled={isLoading !== null}
        className="group w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === "google" ? (
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
          Continue with Google
        </span>
      </button>

      <button
        onClick={() => handleOAuthLogin("azure")}
        disabled={isLoading !== null}
        className="group w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-white border border-zinc-200 rounded-2xl hover:border-zinc-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === "azure" ? (
          <div className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
        )}
        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 transition-colors">
          Continue with Microsoft
        </span>
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0612] p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#0d0618] to-[#0a0612]" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 animate-float animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/15 animate-float-delayed animate-pulse-glow" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-fuchsia-600/10 animate-float" style={{ animationDelay: '-10s' }} />
        
        {/* Accent glow lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        
        {/* Noise texture */}
        <div className="noise-overlay" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-purple-500/30">
              <svg className="w-6 h-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white/90 tracking-tight">LinkedInbox</span>
          </div>
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            Does anyone actually<br />
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent animate-shimmer">want this?</span>
          </h1>
          <p className="text-lg text-purple-200/70 max-w-md leading-relaxed">
            You've reached out to hundreds of people. But do you really know how you're performing? 
            Is your problem painful enough? Is your cold outreach actually validating your idea—or just burning leads?
          </p>
          <p className="text-base text-purple-300/50 max-w-md leading-relaxed">
            Import your LinkedIn messages and get the truth: market pull, response patterns, 
            and whether people care about what you're building.
          </p>
          
          <div className="flex items-center gap-8 pt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Market</div>
              <div className="text-sm text-purple-300/60">Pull score</div>
            </div>
            <div className="w-px h-12 bg-purple-500/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">AI</div>
              <div className="text-sm text-purple-300/60">Prospect analysis</div>
            </div>
            <div className="w-px h-12 bg-purple-500/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Truth</div>
              <div className="text-sm text-purple-300/60">Not vanity metrics</div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-purple-300/50">
          For founders validating ideas through cold outreach
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-[#faf9fb]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-10">
            <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">LinkedInbox</h1>
            <p className="text-zinc-500 text-sm mt-1">Is your outreach validating your idea?</p>
          </div>

          {/* Form header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-zinc-900 mb-2">
              Get the truth
            </h2>
            <p className="text-zinc-500 text-sm">
              See if your cold outreach is actually working
            </p>
          </div>

          <Suspense fallback={
            <div className="space-y-4">
              <div className="w-full h-14 bg-zinc-200 rounded-2xl animate-pulse" />
              <div className="w-full h-14 bg-zinc-200 rounded-2xl animate-pulse" />
            </div>
          }>
            <LoginForm />
          </Suspense>

          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-400 leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
