"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createCoverLetter, deleteCoverLetter } from "@/actions/cover-letter";
import {
  FileText,
  PenBox,
  Trash2,
  Plus,
  Sparkles,
  Loader2,
  X,
  Briefcase,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CoverLetter {
  id: string;
  companyName: string;
  jobTitle: string;
  content: string;
  createdAt: Date;
}

interface Props {
  initialLetters: CoverLetter[];
}

export default function CoverLetterDashboard({ initialLetters }: Props) {
  const router = useRouter();
  const [letters, setLetters] = useState<CoverLetter[]>(initialLetters);
  const [isOpen, setIsOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim() || !jobTitle.trim() || !jobDescription.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setGenerating(true);
    try {
      const newLetter = await createCoverLetter({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
      });

      // Clear fields and close modal
      setCompanyName("");
      setJobTitle("");
      setJobDescription("");
      setIsOpen(false);

      // Redirect to the new cover letter edit page
      router.push(`/cover-letter/${newLetter.id}`);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate cover letter. Please try again.");
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;

    setDeletingId(id);
    try {
      await deleteCoverLetter(id);
      setLetters(letters.filter((l) => l.id !== id));
      router.refresh();
    } catch (err) {
      console.error("Failed to delete cover letter:", err);
      alert("Failed to delete cover letter");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top action header */}
      <div className="flex justify-between items-center bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Cover Letters</h1>
          <p className="text-zinc-400 text-sm mt-1">Generate and manage tailored cover letters for your target roles</p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-semibold shadow-lg shrink-0 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create New
        </Button>
      </div>

      {/* Letters list */}
      {letters.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-zinc-900/10 border border-zinc-900 rounded-2xl py-20 space-y-4">
          <div className="p-4 rounded-full bg-indigo-500/10 text-indigo-400">
            <FileText className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">No Cover Letters Yet</h3>
            <p className="text-zinc-400 text-sm max-w-sm">
              Generate a high-conversion, professional cover letter tailored specifically to your target job using Gemini AI.
            </p>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold flex items-center gap-2 border border-indigo-400/20"
          >
            <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
            Generate Cover Letter
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="bg-zinc-900/20 border border-zinc-900 p-5 rounded-2xl hover:border-zinc-800 transition duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition duration-200 line-clamp-1">
                      {letter.jobTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-indigo-400/80" />
                      <span className="truncate">{letter.companyName}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(letter.id)}
                    disabled={deletingId === letter.id}
                    className="p-2 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-rose-500/30 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition"
                    title="Delete Letter"
                  >
                    {deletingId === letter.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                  {letter.content}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-900/60">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(letter.createdAt).toLocaleDateString()}
                </div>
                <Link
                  href={`/cover-letter/${letter.id}`}
                  className="flex items-center gap-1 text-sm font-semibold text-white hover:text-indigo-400 transition duration-200"
                >
                  Edit & Export <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Generate Tailored Cover Letter
              </h2>
              <p className="text-zinc-400 text-xs md:text-sm mt-1">
                Provide details about the target job description. We will optimize your cover letter using Gemini AI.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="comp" className="text-xs font-semibold text-zinc-300">
                    Company Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="comp"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Stripe"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 text-sm"
                    required
                    disabled={generating}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="title" className="text-xs font-semibold text-zinc-300">
                    Job Title <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 text-sm"
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="desc" className="text-xs font-semibold text-zinc-300">
                  Job Description / Requirements <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  id="desc"
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements and responsibilities here to tailor your cover letter..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 text-sm resize-none leading-relaxed"
                  required
                  disabled={generating}
                />
              </div>

              <Button
                type="submit"
                disabled={generating}
                className="w-full py-3 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition flex items-center justify-center gap-2 text-sm shadow-xl"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI Coach is tailoring achievements...
                  </>
                ) : (
                  <>
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
