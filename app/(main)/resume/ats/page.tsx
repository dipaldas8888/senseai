"use client";

import React, { useState, useRef } from "react";
import { analyzeResume, parseResumeFile } from "@/actions/resume";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ATSPage() {
  const [content, setContent] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError("");
    setFileLoading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await parseResumeFile(formData);
      if (result.error) {
        setFileError(result.error);
        setFileName("");
      } else if (result.text) {
        setContent(result.text);
      } else {
        setFileError(
          "Could not extract text from this file. Please paste your resume text manually below.",
        );
        setFileName("");
      }
    } catch (err: any) {
      setFileError(
        err.message ||
          "Failed to parse file. Please try pasting the text manually.",
      );
      setFileName("");
    } finally {
      setFileLoading(false);
    }
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please upload or paste your resume content first");
      return;
    }
    setError("");
    setAnalyzing(true);
    try {
      const result = await analyzeResume(content, jobDesc || undefined);
      setAtsScore(result.feedback.atsScore);
      setFeedback(result.feedback);
    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const color =
    atsScore === null
      ? null
      : atsScore >= 80
        ? {
            stroke: "#10b981",
            text: "text-emerald-400",
            label: "Excellent Match",
            bg: "bg-emerald-500/10 border-emerald-500/20",
          }
        : atsScore >= 65
          ? {
              stroke: "#f59e0b",
              text: "text-amber-400",
              label: "Good Match",
              bg: "bg-amber-500/10 border-amber-500/20",
            }
          : {
              stroke: "#ef4444",
              text: "text-rose-400",
              label: "Needs Improvement",
              bg: "bg-rose-500/10 border-rose-500/20",
            };

  const offset = atsScore !== null ? 251.2 - (251.2 * atsScore) / 100 : 251.2;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-start gap-4 bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
          <Link
            href="/resume"
            className="p-2 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">ATS Resume Scorer</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Upload your resume (PDF or TXT) or paste the text. Gemini AI
              audits keyword alignment and returns a detailed ATS score report.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Input */}
          <form onSubmit={handle} className="lg:col-span-7 space-y-5">
            {/* File Upload Zone */}
            <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <Upload className="h-4 w-4 text-indigo-400" />
                Upload Resume
              </h2>

              <div
                className="relative border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:border-zinc-700 transition cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.text"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {fileLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                    <p className="text-sm text-zinc-400">
                      Extracting text from file...
                    </p>
                  </div>
                ) : fileName ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-6 w-6 text-emerald-400 shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-emerald-400">
                        {fileName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Text extracted successfully — ready to analyze
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileName("");
                        setContent("");
                      }}
                      className="ml-auto text-zinc-500 hover:text-rose-400 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition">
                      <Upload className="h-7 w-7 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Supports PDF, DOCX, and TXT files
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  {fileError}
                </p>
              )}
            </div>

            {/* Paste fallback */}
            <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-3">
              <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-400" />
                Or Paste Resume Text
              </h2>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder={
                  "JOHN DOE | Software Engineer\njohn@email.com | +1 555 0100 | San Francisco\n\nSUMMARY\nDetail-oriented engineer...\n\nEXPERIENCE\nSoftware Engineer — Company (2021 – Present)\n• Built scalable APIs serving 2M+ users"
                }
                className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-zinc-200 placeholder-zinc-700 outline-none focus:border-zinc-800 resize-none font-mono leading-relaxed"
              />
            </div>

            {/* Job Description */}
            {/* <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-3">
              <h2 className="text-sm font-bold text-zinc-200">Target Job Description <span className="text-zinc-500 font-normal">(optional — greatly improves accuracy)</span></h2>
              <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={4}
                placeholder="Paste the job requirements and skill lists here for a more targeted analysis..."
                className="w-full rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-sm text-zinc-200 placeholder-zinc-700 outline-none focus:border-zinc-800 resize-none leading-relaxed" />
            </div> */}

            <Button
              type="submit"
              disabled={analyzing || !content.trim()}
              className="w-full py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold flex items-center justify-center gap-2 shadow-xl"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gemini is auditing your resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze & Get ATS Score
                </>
              )}
            </Button>
          </form>

          {/* Right: Score Report */}
          <div className="lg:col-span-5 space-y-5">
            {atsScore === null ? (
              <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800">
                  <HelpCircle className="h-10 w-10 text-zinc-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    No Report Yet
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                    Upload your resume and click Analyze to get your ATS keyword
                    alignment report.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-5">
                {/* Gauge */}
                <div className="flex flex-col items-center py-2 space-y-3">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg
                      className="w-full h-full -rotate-90"
                      viewBox="0 0 112 112"
                    >
                      <circle
                        cx="56"
                        cy="56"
                        r="40"
                        className="stroke-zinc-900"
                        strokeWidth="9"
                        fill="none"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="40"
                        stroke={color?.stroke}
                        strokeWidth="9"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 1.2s ease" }}
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-extrabold text-white block">
                        {atsScore}
                      </span>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                        /100
                      </span>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      ATS Match Score
                    </span>
                    <div
                      className={`px-3 py-1 rounded text-xs font-semibold border w-fit mx-auto ${color?.text} ${color?.bg}`}
                    >
                      {color?.label}
                    </div>
                  </div>
                </div>

                {feedback?.summary && (
                  <div className="border-t border-zinc-900/60 pt-4 space-y-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Coach Summary
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {feedback.summary}
                    </p>
                  </div>
                )}

                {feedback?.strengths?.length > 0 && (
                  <div className="border-t border-zinc-900/60 pt-4 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Strengths
                    </span>
                    <ul className="space-y-1.5">
                      {feedback.strengths.map((s: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-zinc-350 flex gap-2 leading-relaxed"
                        >
                          <span className="text-emerald-400 shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback?.weaknesses?.length > 0 && (
                  <div className="border-t border-zinc-900/60 pt-4 space-y-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Flagged Areas
                    </span>
                    <ul className="space-y-1.5">
                      {feedback.weaknesses.map((w: string, i: number) => (
                        <li
                          key={i}
                          className="text-xs text-zinc-350 flex gap-2 leading-relaxed"
                        >
                          <span className="text-amber-400 shrink-0">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {feedback?.missingKeywords?.length > 0 && (
                  <div className="border-t border-zinc-900/60 pt-4 space-y-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Missing Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {feedback.missingKeywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {feedback?.actionItems?.length > 0 && (
                  <div className="border-t border-zinc-900/60 pt-4 space-y-3">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Optimization Checklist
                    </span>
                    <ul className="space-y-2">
                      {feedback.actionItems.map((item: string, i: number) => (
                        <li
                          key={i}
                          className="flex gap-2.5 items-start text-xs text-zinc-350"
                        >
                          <span className="h-4 w-4 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[9px] font-bold text-indigo-400 shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
