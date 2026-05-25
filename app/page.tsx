import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Zap, Shield, Cpu } from "lucide-react";
import Hero from "@/components/Hero";

export default async function Home() {
  const user = await currentUser();

  const features = [
    {
      title: "Real-Time AI Telemetry",
      description:
        "Monitor tokens, accuracy metrics, and latency logs directly as request processing occurs.",
      icon: Zap,
    },
    {
      title: "Secure Enterprise Guardrails",
      description:
        "Configure policies and safety guardrails to automatically filter PII and malicious inputs.",
      icon: Shield,
    },
    {
      title: "Model Hub & Performance Routing",
      description:
        "Route requests dynamically to different LLMs based on complexity, speed requirements, and cost.",
      icon: Cpu,
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Immersive Hero Section spanning full viewport height */}
      <Hero />
      
      {/* Features Showcase Section */}
      <section className="relative z-10 bg-zinc-950 border-t border-zinc-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Built for Modern AI Teams
            </h2>
            <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
              Everything you need to orchestrate, analyze, and secure your production-ready LLM application logic.
            </p>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all hover:border-zinc-800 hover:bg-zinc-900/30 group"
                >
                  <div className="inline-flex items-center justify-center p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 mb-6 transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
