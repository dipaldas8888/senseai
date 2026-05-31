"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "@/actions/user";
import { Sparkles, Plus, X, Loader2 } from "lucide-react";

const INDUSTRIES = [
  "Technology & Software",
  "Healthcare & Medicine",
  "Finance & Investment",
  "Marketing & Creative",
  "Education & Training",
  "Engineering",
  "Business & Consulting",
  "Legal",
  "Sales & Commerce",
];

export default function OnboardingForm() {
  const router = useRouter();
  const [industry, setIndustry] = useState("");
  const [subIndustry, setSubIndustry] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !skills.includes(cleanSkill)) {
      setSkills([...skills, cleanSkill]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cleanSkill = skillInput.trim();
      if (cleanSkill && !skills.includes(cleanSkill)) {
        setSkills([...skills, cleanSkill]);
        setSkillInput("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!industry) {
      setError("Please select an industry");
      return;
    }
    if (skills.length === 0) {
      setError("Please add at least one skill");
      return;
    }

    setSubmitting(true);
    try {
      const combinedIndustry = subIndustry.trim()
        ? `${industry} - ${subIndustry.trim()}`
        : industry;

      await updateUser({
        industry: combinedIndustry,
        experience: Number(experience),
        bio,
        skills,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit onboarding profile. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative">
      {/* Decorative gradient overlay */}
      <div className="absolute -top-12 -left-12 -z-10 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 -z-10 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-indigo-400" />
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Complete Your Profile
          </h2>
        </div>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Provide some quick details about your career background so Sensai can customize your interview guides, AI cover letters, and roadmaps.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Industry */}
        <div className="space-y-2">
          <label htmlFor="industry" className="block text-sm font-semibold text-zinc-200">
            Primary Industry <span className="text-indigo-400">*</span>
          </label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500"
            required
          >
            <option value="" disabled>Select your industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Sub-industry / Specialization */}
        <div className="space-y-2">
          <label htmlFor="subIndustry" className="block text-sm font-semibold text-zinc-200">
            Specialization / Sub-Industry
          </label>
          <input
            id="subIndustry"
            type="text"
            value={subIndustry}
            onChange={(e) => setSubIndustry(e.target.value)}
            placeholder="e.g. Frontend Development, Sales Operations"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500"
          />
        </div>

        {/* Years of Experience */}
        <div className="space-y-2">
          <label htmlFor="experience" className="block text-sm font-semibold text-zinc-200">
            Years of Experience <span className="text-indigo-400">*</span>
          </label>
          <input
            id="experience"
            type="number"
            min="0"
            max="50"
            value={experience}
            onChange={(e) => setExperience(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 outline-none transition focus:border-indigo-500"
            required
          />
        </div>

        {/* Skills Tag Input */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-200">
            Skills <span className="text-indigo-400">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Next.js, Product Design (press Enter to add)"
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-white flex items-center justify-center transition active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Skill tags container */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 p-3 bg-zinc-950/50 border border-zinc-850 rounded-xl min-h-[50px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium transition hover:bg-indigo-500/15"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-indigo-200 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Professional Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-zinc-200">
            Professional Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself, your career path, or what roles you are actively targeting..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 resize-none leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 mt-4 rounded-xl font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-xl"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Completing Profile...
            </>
          ) : (
            <>
              Complete Onboarding
            </>
          )}
        </button>
      </form>
    </div>
  );
}
