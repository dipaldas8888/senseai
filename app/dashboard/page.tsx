import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Cpu,
  Activity,
  ArrowUpRight,
  Shield,
  Zap,
  Globe,
  Database,
  ArrowRight,
  Clock,
  Sparkles
} from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  // Mock analytics data
  const stats = [
    {
      title: "Model Accuracy",
      value: "99.4%",
      change: "+0.15%",
      isPositive: true,
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
    },
    {
      title: "Active Predictions",
      value: "142.8k",
      change: "+12.4%",
      isPositive: true,
      icon: Activity,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    },
    {
      title: "API Tokens Saved",
      value: "$1,824.50",
      change: "+8.2%",
      isPositive: true,
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
    },
    {
      title: "Global Queries",
      value: "9.2M",
      change: "-1.1%",
      isPositive: false,
      icon: Globe,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
    }
  ];

  const recentPipelines = [
    { name: "Customer Churn Prediction", model: "SenseLLM-Large", status: "Active", latency: "142ms", health: 100 },
    { name: "Support Ticket Router", model: "SenseLLM-Medium", status: "Active", latency: "89ms", health: 98 },
    { name: "Financial Risk Evaluator", model: "SenseLLM-X", status: "Warning", latency: "312ms", health: 85 },
    { name: "Marketing Content Generator", model: "SenseLLM-Small", status: "Active", latency: "65ms", health: 100 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />



      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium mb-1">
              <Sparkles className="h-4 w-4" />
              <span>Welcome Back to SenseAI</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Hello, {user?.firstName || user?.username || "Developer"}
            </h1>
            <p className="text-zinc-400 mt-1">
              Here is what's happening with your intelligence pipelines today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              <span>Deploy New Model</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm transition-all hover:border-zinc-800 hover:bg-zinc-900/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-400">{stat.title}</span>
                  <div className={`p-2 rounded-lg border ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-semibold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-zinc-500">vs last week</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dash Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Active Pipelines */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-white">Active Pipelines</h3>
                  <p className="text-sm text-zinc-400">Deployed models serving real-time requests.</p>
                </div>
                <Link href="#" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  <span>View All</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 text-xs font-semibold uppercase">
                      <th className="pb-3">Pipeline / Model</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Latency</th>
                      <th className="pb-3 text-right">Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {recentPipelines.map((pipeline, i) => (
                      <tr key={i} className="group hover:bg-zinc-900/10">
                        <td className="py-4">
                          <div className="font-medium text-white">{pipeline.name}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{pipeline.model}</div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                            pipeline.status === "Active" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${pipeline.status === "Active" ? "bg-emerald-400" : "bg-rose-400"}`} />
                            {pipeline.status}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-sm text-zinc-300">{pipeline.latency}</td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm font-medium font-mono text-zinc-300">{pipeline.health}%</span>
                            <div className="h-1.5 w-12 rounded-full bg-zinc-800 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${pipeline.health === 100 ? "bg-indigo-500" : "bg-amber-500"}`}
                                style={{ width: `${pipeline.health}%` }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Stats / Info sidebar */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-white mb-4">Credentials & Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Auth Method</div>
                      <div className="text-xs text-zinc-500">Secure via Clerk</div>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 py-0.5 px-2 rounded-full">Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Instance Type</div>
                      <div className="text-xs text-zinc-500">SenseNode Sandbox</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 py-0.5 px-2 rounded-full">Shared</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-gradient-to-br from-indigo-950/30 to-violet-950/20 p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <span>Go Pro</span>
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Unlock high-throughput dedicated execution servers, advanced LLM fine-tuning, and priority token routing.
              </p>
              <button className="w-full text-center bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-sm font-semibold py-2.5 rounded-lg transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
