"use client";

import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignupForm() {
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
    <div className="space-y-3">
      <button
        onClick={() => handleOAuthLogin("google")}
        disabled={isLoading !== null}
        className="group w-full flex items-center justify-center gap-3 px-5 py-4 bg-[#6039ed] hover:bg-[#4c2bc4] border border-[#6039ed] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#6039ed]/25"
      >
        {isLoading === "google" ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="white"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="white"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="white"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="white"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="text-sm font-semibold text-white">
          Get Started with Google
        </span>
      </button>

      <button
        onClick={() => handleOAuthLogin("azure")}
        disabled={isLoading !== null}
        className="group w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.06] hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading === "azure" ? (
          <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
        )}
        <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
          Continue with Microsoft
        </span>
      </button>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-sm text-red-400 text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

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

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6039ed]/20 via-transparent to-transparent" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#6039ed]/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <Logo />
        <Link 
          href="/" 
          className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
          ← Back to home
        </Link>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#6039ed]/20 to-transparent opacity-50 pointer-events-none" />
            
            <div className="relative">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#6039ed]/10 border border-[#6039ed]/20 mb-4">
                  <svg className="w-6 h-6 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Start analyzing in 2 minutes
                </h1>
                <p className="text-zinc-500">
                  Free forever for up to 50 conversations
                </p>
              </div>

              {/* Signup form */}
              <Suspense fallback={
                <div className="space-y-3">
                  <div className="w-full h-14 bg-white/5 rounded-xl animate-pulse" />
                  <div className="w-full h-14 bg-white/5 rounded-xl animate-pulse" />
                </div>
              }>
                <SignupForm />
              </Suspense>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">2 min</div>
                  <div className="text-xs text-zinc-500">Setup time</div>
                </div>
                <div className="text-center border-x border-white/5">
                  <div className="text-xl font-bold text-white">100%</div>
                  <div className="text-xs text-zinc-500">Private</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">Free</div>
                  <div className="text-xs text-zinc-500">To start</div>
                </div>
              </div>

              {/* What you get */}
              <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">What you&apos;ll get</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-400">Your Market Pull score</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-400">AI prospect classification</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-4 h-4 text-[#6039ed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-zinc-400">Response rate & engagement</span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="mt-6 text-xs text-zinc-600 text-center leading-relaxed">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-zinc-400 hover:text-white transition-colors">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#6039ed] hover:text-[#7c5cf5] transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6039ed]/30 to-transparent" />
    </div>
  );
}
