import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { 
  ArrowRight, 
  Cpu, 
  Zap, 
  Shield, 
  BarChart3, 
  Lock, 
  Compass, 
  Sparkles 
} from "lucide-react";

export default async function Home() {
  const user = await currentUser();

  const features = [
    {
      title: "Real-Time AI Telemetry",
      description: "Monitor tokens, accuracy metrics, and latency logs directly as request processing occurs.",
      icon: Zap,
    },
    {
      title: "Secure Enterprise Guardrails",
      description: "Configure policies and safety guardrails to automatically filter PII and malicious inputs.",
      icon: Shield,
    },
    {
      title: "Model Hub & Performance Routing",
      description: "Route requests dynamically to different LLMs based on complexity, speed requirements, and cost.",
      icon: Cpu,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Decorative background grids & gradient glows */}
      <div className="absolute top-[-10%] left-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]" />
      <div 
        className="absolute inset-0 -z-20 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, #ffffff 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />



      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl flex flex-col items-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-sm font-semibold text-indigo-400 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Introducing SenseAI 1.0</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            A Unified Hub for
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              AI Analytics & Routing
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            Secure, optimize, and observe your large language model integrations in real-time. Make every call context-aware, low-latency, and cost-efficient.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-95"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 active:scale-95"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({ variant: "outline", size: "lg", className: "px-6 py-3 text-base font-semibold" })}
                >
                  Request Demo
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative mx-auto mt-20 max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-900/30 p-2 shadow-2xl backdrop-blur-sm sm:p-4">
          <div className="absolute -top-6 left-1/2 -z-10 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-[100px]" />
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-inner">
            {/* Mock Dashboard Topbar */}
            <div className="flex h-11 items-center justify-between border-b border-zinc-900 bg-zinc-900/30 px-4">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="rounded bg-zinc-900 px-10 py-1 text-xs font-mono text-zinc-500 border border-zinc-850">
                senseai.dev/dashboard
              </div>
              <div className="h-4 w-4 rounded bg-zinc-900" />
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-6 text-left grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 w-48 rounded bg-zinc-850 animate-pulse" />
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-zinc-900 bg-zinc-900/10 p-4">
                    <div className="h-3 w-16 rounded bg-zinc-850 mb-3" />
                    <div className="h-5 w-24 rounded bg-zinc-800" />
                  </div>
                  <div className="rounded-lg border border-zinc-900 bg-zinc-900/10 p-4">
                    <div className="h-3 w-20 rounded bg-zinc-850 mb-3" />
                    <div className="h-5 w-16 rounded bg-zinc-800" />
                  </div>
                  <div className="rounded-lg border border-zinc-900 bg-zinc-900/10 p-4">
                    <div className="h-3 w-12 rounded bg-zinc-850 mb-3" />
                    <div className="h-5 w-20 rounded bg-zinc-800" />
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-900 bg-zinc-900/15 p-6 h-48 flex items-end justify-between gap-2">
                  <div className="w-[10%] bg-zinc-850 rounded-t h-[40%] animate-pulse" />
                  <div className="w-[10%] bg-indigo-900/40 rounded-t h-[65%]" />
                  <div className="w-[10%] bg-zinc-850 rounded-t h-[30%]" />
                  <div className="w-[10%] bg-indigo-900/50 rounded-t h-[75%]" />
                  <div className="w-[10%] bg-zinc-850 rounded-t h-[50%]" />
                  <div className="w-[10%] bg-indigo-600/70 rounded-t h-[95%]" />
                  <div className="w-[10%] bg-zinc-850 rounded-t h-[60%]" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 w-28 rounded bg-zinc-850" />
                <div className="rounded-lg border border-zinc-900 bg-zinc-900/10 p-4 space-y-3">
                  <div className="flex justify-between items-center"><div className="h-3 w-24 rounded bg-zinc-850" /><div className="h-3.5 w-8 rounded bg-zinc-800" /></div>
                  <div className="flex justify-between items-center"><div className="h-3 w-20 rounded bg-zinc-850" /><div className="h-3.5 w-10 rounded bg-zinc-800" /></div>
                  <div className="flex justify-between items-center"><div className="h-3 w-28 rounded bg-zinc-850" /><div className="h-3.5 w-6 rounded bg-zinc-800" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900 mt-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group rounded-xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-sm transition-all hover:border-zinc-800 hover:bg-zinc-900/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 border-t border-zinc-900">
        <p className="text-sm text-zinc-600">
          &copy; 2026 SenseAI. All rights reserved. Secure identity powered by Clerk.
        </p>
      </footer>
    </div>
  );
}
