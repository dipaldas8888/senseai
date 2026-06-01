"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateCoverLetter } from "@/actions/cover-letter";
import {
  ArrowLeft,
  Copy,
  Printer,
  Save,
  Loader2,
  Check,
  Building,
  Briefcase,
  Sparkles,
  PenBox,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CoverLetter {
  id: string;
  companyName: string;
  jobTitle: string;
  content: string;
  jobDescription: string | null;
}

interface Props {
  initialLetter: CoverLetter;
}

export default function CoverLetterEditor({ initialLetter }: Props) {
  const router = useRouter();
  const [content, setContent] = useState(initialLetter.content);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Monitor changes
  useEffect(() => {
    setHasChanges(content !== initialLetter.content);
  }, [content, initialLetter.content]);

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setError("");
    try {
      await updateCoverLetter(initialLetter.id, content);
      setHasChanges(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save cover letter changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6 max-w-4xl mx-auto print:bg-white print:text-zinc-900 print:pt-0">
      {/* Navigation and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl backdrop-blur-sm print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/cover-letter"
            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight truncate max-w-xs md:max-w-sm">
              {initialLetter.jobTitle}
            </h1>
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs">
              <Building className="h-3.5 w-3.5" />
              <span>{initialLetter.companyName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition flex items-center gap-2 text-sm font-semibold"
            title="Print Letter"
          >
            <Printer className="h-4 w-4" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white transition flex items-center gap-2 text-sm font-semibold"
            title="Copy to Clipboard"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 hidden md:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden md:inline">Copy</span>
              </>
            )}
          </button>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`rounded-xl font-semibold flex items-center gap-2 shadow-lg ${
              hasChanges
                ? "bg-white text-zinc-950 hover:bg-zinc-200"
                : "bg-zinc-800 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm print:hidden">
          {error}
        </div>
      )}

      {/* Editor & Preview Split/Tab */}
      <div className="grid gap-6 md:grid-cols-12 print:block">
        {/* Left column: Editor (7 cols) */}
        <div className="md:col-span-8 bg-zinc-900/10 border border-zinc-900/60 p-5 md:p-6 rounded-2xl space-y-4 print:border-none print:p-0">
          <div className="flex justify-between items-center print:hidden">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <PenBox className="h-4 w-4 text-indigo-400" /> Cover Letter Editor
            </span>
            {hasChanges && (
              <span className="text-xs text-amber-400 font-semibold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 animate-pulse">
                Unsaved changes
              </span>
            )}
          </div>

          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[600px] rounded-xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-100 placeholder-zinc-700 outline-none focus:border-zinc-800 text-sm md:text-base leading-relaxed resize-y font-serif print:border-none print:bg-white print:text-zinc-950 print:p-0 print:min-h-0 print:overflow-visible"
            placeholder="Write your cover letter here..."
          />
        </div>

        {/* Right column: Target Description Reference (4 cols) */}
        <div className="md:col-span-4 bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-4 h-fit max-h-[670px] overflow-y-auto print:hidden">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-indigo-400" /> Target Job Description
          </span>
          <div className="text-xs text-zinc-400 leading-relaxed space-y-3">
            <p className="font-semibold text-zinc-300">
              Role Details for {initialLetter.jobTitle} at {initialLetter.companyName}:
            </p>
            <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-900 font-mono text-[11px] leading-relaxed max-h-[450px] overflow-y-auto whitespace-pre-wrap">
              {initialLetter.jobDescription || "No job description details saved."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
