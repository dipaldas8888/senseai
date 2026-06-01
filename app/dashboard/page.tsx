import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma as db } from "@/lib/prisma";
import { checkAndSyncUser } from "@/lib/userSync";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Brain,
  Award,
  Zap,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  TrendingDown,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import React from "react";

export default async function DashboardPage() {
  // Sync the authenticated user with the database
  await checkAndSyncUser();

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Fetch user details including their industry insights
  const user = await db.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      industryInsight: true,
    },
  });

  // If user hasn't completed onboarding, redirect them
  if (!user || !user.industry) {
    redirect("/onboarding");
  }

  const insights = user.industryInsight;

  // Process skills comparison
  const userSkills = user.skills || [];
  const topSkills = insights?.topSkills || [];
  const recommendedSkills = insights?.recommendedSkills || [];

  // Categorize user skills
  const matchedSkills = userSkills.filter(
    (skill) =>
      topSkills.some((s) => s.toLowerCase() === skill.toLowerCase()) ||
      recommendedSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
  );

  const missingTopSkills = topSkills.filter(
    (skill) => !userSkills.some((s) => s.toLowerCase() === skill.toLowerCase())
  );

  // Cast salaryRanges to array of objects
  const salaryRanges = (insights?.salaryRanges as any[]) || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-zinc-900/30 border border-zinc-800/80 p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {user.industry}
              </span>
              <span className="text-zinc-500 text-sm">•</span>
              <span className="text-zinc-400 text-sm">
                {user.experience} Years Experience
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Welcome back, {user.name || clerkUser.firstName || "Professional"}
            </h1>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {user.bio || "Complete your profile to see tailored recommendations and generate custom cover letters."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/cover-letter">
              <Button className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold shadow-lg shadow-white/5">
                Generate Cover Letter
              </Button>
            </Link>
            <Link href="/resume">
              <Button className="rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 font-semibold">
                Build Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Growth Rate Card */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl hover:border-zinc-800 transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-zinc-400">Industry Growth Rate</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-extrabold text-white">
                +{insights?.growthRate || 0}%
              </span>
              <p className="text-xs text-zinc-500">Projected annual growth index</p>
            </div>
          </div>

          {/* Demand Card */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl hover:border-zinc-800 transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-zinc-400">Hiring Demand Level</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className={`text-4xl font-extrabold capitalize ${
                insights?.demandLevel?.toLowerCase() === "high" ? "text-emerald-400" : "text-amber-400"
              }`}>
                {insights?.demandLevel || "Medium"}
              </span>
              <p className="text-xs text-zinc-500">Current market request evaluation</p>
            </div>
          </div>

          {/* Next Update Card */}
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl hover:border-zinc-800 transition duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-zinc-400">Insights Refresh Date</span>
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xl font-bold text-white block truncate pt-2">
                {insights?.nextUpdate ? new Date(insights.nextUpdate).toLocaleDateString() : "Next Week"}
              </span>
              <p className="text-xs text-zinc-500">Managed weekly via background Inngest cron</p>
            </div>
          </div>
        </div>

        {/* Dashboard Grid split: Salary Graph and Skills Match */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Salary Ranges Graph (8 cols) */}
          <div className="lg:col-span-7 bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Salary Distribution Graph</h3>
              <p className="text-zinc-400 text-sm">Typical market compensation structures for matching roles</p>
            </div>

            {salaryRanges.length > 0 ? (
              <div className="space-y-6 pt-2">
                {salaryRanges.map((sal, idx) => {
                  const maxSalary = Math.max(...salaryRanges.map((s) => s.max));
                  const minSalary = Math.min(...salaryRanges.map((s) => s.min));
                  
                  // Calculate percentage offset and width for the salary range bar
                  const rangeSpan = maxSalary - minSalary;
                  const startPct = ((sal.min - minSalary) / rangeSpan) * 100;
                  const widthPct = ((sal.max - sal.min) / rangeSpan) * 100;
                  const medianPct = ((sal.median - minSalary) / rangeSpan) * 100;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-zinc-200">{sal.role}</span>
                        <span className="text-xs text-zinc-400 font-mono">
                          ${sal.min.toLocaleString()} - ${sal.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="relative h-6 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-900">
                        {/* Range Bar */}
                        <div
                          className="absolute h-full bg-gradient-to-r from-indigo-500/20 to-indigo-500/40 border-l border-r border-indigo-400/30"
                          style={{
                            left: `${startPct}%`,
                            width: `${widthPct}%`,
                          }}
                        />
                        {/* Median marker dot */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-indigo-300"
                          style={{
                            left: `${medianPct}%`,
                          }}
                          title={`Median: $${sal.median.toLocaleString()}`}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono px-1">
                        <span>Min: ${sal.min.toLocaleString()}</span>
                        <span>Median: ${sal.median.toLocaleString()}</span>
                        <span>Max: ${sal.max.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-500 text-sm">
                No salary distribution data loaded.
              </div>
            )}
          </div>

          {/* Skills Match Analysis (5 cols) */}
          <div className="lg:col-span-5 bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Skills Match Analysis</h3>
              <p className="text-zinc-400 text-sm">Comparing your skills with industry requirements</p>
            </div>

            <div className="space-y-6">
              {/* Matched Skills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Matched Skills ({matchedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.length > 0 ? (
                    matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">No matching skills found in database.</span>
                  )}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Recommended Additions ({missingTopSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {missingTopSkills.length > 0 ? (
                    missingTopSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded border border-dashed border-zinc-800 text-zinc-400 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-500 italic">You match all core top skills! Excellent.</span>
                  )}
                </div>
              </div>

              {/* Market Outlook summary block */}
              <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  Market Outlook Insight
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {insights?.marketOutlook || "Market development expected to grow steadily over the upcoming fiscal quarters."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Industry Trends & Recommended Skills */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Key Trends */}
          <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Core Industry Trends
            </h3>
            <ul className="space-y-3">
              {insights?.keyTrends && insights.keyTrends.length > 0 ? (
                (insights.keyTrends as string[]).map((trend, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-sm text-zinc-350">
                    <span className="h-5 w-5 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{trend}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-500 italic">No industry trends listed yet.</li>
              )}
            </ul>
          </div>

          {/* Recommended Skills to Learn */}
          <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Career Expansion Path
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Focusing on learning the following skills could give you a significant competitive edge in the job market:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {insights?.recommendedSkills && insights.recommendedSkills.length > 0 ? (
                (insights.recommendedSkills as string[]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-medium hover:border-zinc-700 transition"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-zinc-500 italic">No recommendations listed.</span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
