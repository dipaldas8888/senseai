import React from "react";
import Link from "next/link";
import ResumeBuilder from "./ResumeBuilder";
import { BarChart2 } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ATS shortcut banner */}
        <div className="mb-6 flex items-center justify-between bg-indigo-950/40 border border-indigo-500/20 rounded-xl px-5 py-3">
          <p className="text-sm text-indigo-300">Already have a resume? Check your ATS score instantly.</p>
          <Link href="/resume/ats" className="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition shrink-0">
            <BarChart2 className="h-4 w-4" /> Check ATS Score
          </Link>
        </div>
        <ResumeBuilder />
      </main>
    </div>
  );
}
