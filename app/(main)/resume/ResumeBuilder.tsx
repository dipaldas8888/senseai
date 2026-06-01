"use client";

import React, { useState } from "react";
import { generateResume } from "@/actions/resume";
import { Plus, Trash2, Loader2, Sparkles, Download, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumePreview from "./ResumePreview";
import { ClassicTemplate, ModernTemplate, MinimalTemplate } from "./TemplateComponents";
import {
  ResumeFormData, TemplateId, TEMPLATES,
  MONTHS, YEARS, EMPTY_EXPERIENCE, EMPTY_EDUCATION, EMPTY_CERTIFICATION, DEFAULT_FORM,
} from "./types";

const STEPS = ["Template", "Personal", "Experience", "Education", "Skills & Certs", "Generate"];

// Sample data used in template previews
const SAMPLE: ResumeFormData = {
  fullName: "Alex Johnson", targetRole: "Senior Software Engineer",
  email: "alex@example.com", phone: "+1 555 0100", location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alex", website: "alexj.dev",
  summary: "Results-driven engineer with 6+ years building scalable web platforms. Specializes in React, Node.js and cloud infrastructure with a track record of reducing latency by 40%.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
  keyStrengths: ["Technical Leadership", "System Design", "Agile Delivery", "Mentoring"],
  experience: [{
    jobTitle: "Senior Engineer", company: "Tech Corp", location: "San Francisco",
    startMonth: "Jan", startYear: "2021", endMonth: "", endYear: "", current: true,
    description: "• Led development of core platform serving 2M+ users\n• Reduced API latency by 40% through caching architecture\n• Mentored team of 5 junior engineers",
  }, {
    jobTitle: "Software Engineer", company: "Startup Co", location: "Remote",
    startMonth: "Mar", startYear: "2018", endMonth: "Dec", endYear: "2020", current: false,
    description: "• Built customer-facing checkout flow, increasing conversion by 22%\n• Integrated Stripe payments and third-party OAuth providers",
  }],
  education: [{ degree: "B.Sc. Computer Science", institution: "UC Berkeley", location: "Berkeley, CA", startYear: "2014", endYear: "2018", grade: "3.8 GPA" }],
  certifications: [{ name: "AWS Solutions Architect", issuer: "Amazon", year: "2023" }, { name: "Google Cloud Professional", issuer: "Google", year: "2022" }],
};

const inp = "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500 transition";
const lbl = "block text-xs font-semibold text-zinc-300 mb-1";
const sel = `${inp} cursor-pointer`;

function downloadAsPDF(fullName: string) {
  const el = document.getElementById("resume-preview");
  if (!el) return;
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${fullName || "Resume"}</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}@page{margin:0;size:A4}</style>
  </head><body>${el.outerHTML}</body></html>`);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

export default function ResumeBuilder() {
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>("classic");
  const [form, setForm] = useState<ResumeFormData>({ ...DEFAULT_FORM, experience: [{ ...EMPTY_EXPERIENCE }], education: [{ ...EMPTY_EDUCATION }] });
  const [skillInput, setSkillInput] = useState("");
  const [strengthInput, setStrengthInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof ResumeFormData, value: any) => setForm(f => ({ ...f, [field]: value }));
  const setExp = (i: number, field: string, value: any) => setForm(f => { const e = [...f.experience]; (e[i] as any)[field] = value; return { ...f, experience: e }; });
  const setEdu = (i: number, field: string, value: any) => setForm(f => { const e = [...f.education]; (e[i] as any)[field] = value; return { ...f, education: e }; });
  const setCert = (i: number, field: string, value: any) => setForm(f => { const e = [...(f.certifications || [])]; (e[i] as any)[field] = value; return { ...f, certifications: e }; });

  const addSkill = (val: string, field: "skills" | "keyStrengths") => {
    const s = val.trim();
    if (s && !(form[field] as string[]).includes(s)) set(field, [...(form[field] as string[]), s]);
  };

  const previewData = step === 0 ? SAMPLE : form;

  const handleGenerate = async () => {
    setError(""); setGenerating(true);
    try { await generateResume(form); setGenerated(true); }
    catch (e: any) { setError(e.message || "Generation failed"); }
    finally { setGenerating(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 bg-zinc-900/30 border border-zinc-800/80 p-5 rounded-2xl">
        <h1 className="text-xl font-bold text-white">AI Resume Builder</h1>
        <p className="text-zinc-400 text-sm mt-1">Choose a template → fill details → Gemini polishes it → download PDF matching your template</p>
      </div>

      {/* Step tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {STEPS.map((label, i) => (
          <button key={label} onClick={() => setStep(i)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              i === step ? "bg-white text-zinc-950" : i < step ? "bg-zinc-900 text-emerald-400 border border-zinc-800" : "bg-zinc-900/30 text-zinc-500 border border-zinc-900"
            }`}>
            {i < step ? <Check className="h-3 w-3" /> : <span className="h-4 w-4 rounded-full border border-current text-center text-[9px] leading-4">{i + 1}</span>}
            {label}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-300 text-sm">{error}</div>}

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-5">

          {/* STEP 0: Template */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Choose Your Template</h2>
              <p className="text-zinc-400 text-sm">The PDF download will match this design exactly.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {TEMPLATES.map((t) => {
                  const isSelected = templateId === t.id;
                  return (
                    <button key={t.id} onClick={() => setTemplateId(t.id as TemplateId)}
                      className={`relative flex flex-col rounded-xl overflow-hidden border-2 transition-all ${isSelected ? "border-indigo-500 shadow-lg shadow-indigo-500/20" : "border-zinc-800 hover:border-zinc-700"}`}>
                      {/* Mini thumbnail — fixed 220px height container, scale inner content */}
                      <div className="bg-white overflow-hidden" style={{ height: 220, position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "170%", transformOrigin: "top left", transform: "scale(0.59)", pointerEvents: "none" }}>
                          {t.id === "classic" && <ClassicTemplate data={SAMPLE} />}
                          {t.id === "modern" && <ModernTemplate data={SAMPLE} />}
                          {t.id === "minimal" && <MinimalTemplate data={SAMPLE} />}
                        </div>
                      </div>
                      <div className={`p-3 text-left ${isSelected ? "bg-indigo-950/60" : "bg-zinc-900/60"}`}>
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{t.description}</p>
                      </div>
                      {isSelected && <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 1: Personal */}
          {step === 1 && (
            <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-bold text-white">Personal Information</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className={lbl}>Full Name *</label><input className={inp} value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Alex Johnson" /></div>
                <div><label className={lbl}>Target Role</label><input className={inp} value={form.targetRole} onChange={e => set("targetRole", e.target.value)} placeholder="Software Engineer" /></div>
                <div><label className={lbl}>Email *</label><input type="email" className={inp} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
                <div><label className={lbl}>Phone</label><input className={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+91 98765 43210" /></div>
                <div><label className={lbl}>Location</label><input className={inp} value={form.location} onChange={e => set("location", e.target.value)} placeholder="New Delhi, India" /></div>
                <div><label className={lbl}>LinkedIn</label><input className={inp} value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="linkedin.com/in/yourname" /></div>
                <div className="sm:col-span-2"><label className={lbl}>Website / Portfolio</label><input className={inp} value={form.website} onChange={e => set("website", e.target.value)} placeholder="yourportfolio.com" /></div>
                <div className="sm:col-span-2"><label className={lbl}>Professional Summary</label><textarea className={`${inp} resize-none`} rows={4} value={form.summary} onChange={e => set("summary", e.target.value)} placeholder="Results-driven engineer with 4+ years of experience..." /></div>
              </div>
            </div>
          )}

          {/* STEP 2: Experience */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Work Experience</h2>
              {form.experience.map((exp, i) => (
                <div key={i} className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-3 relative">
                  {form.experience.length > 1 && <button onClick={() => setForm(f => ({ ...f, experience: f.experience.filter((_, idx) => idx !== i) }))} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>}
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Position {i + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><label className={lbl}>Job Title</label><input className={inp} value={exp.jobTitle} onChange={e => setExp(i, "jobTitle", e.target.value)} placeholder="Frontend Engineer" /></div>
                    <div><label className={lbl}>Employer</label><input className={inp} value={exp.company} onChange={e => setExp(i, "company", e.target.value)} placeholder="Company Name" /></div>
                    <div><label className={lbl}>Location</label><input className={inp} value={exp.location} onChange={e => setExp(i, "location", e.target.value)} placeholder="City, Country" /></div>
                    <div className="flex items-end pb-1"><label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer"><input type="checkbox" checked={exp.current} onChange={e => setExp(i, "current", e.target.checked)} className="accent-indigo-500 w-4 h-4" /> Currently working here</label></div>
                  </div>
                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                    <div><label className={lbl}>Start Month</label><select className={sel} value={exp.startMonth} onChange={e => setExp(i, "startMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select></div>
                    <div><label className={lbl}>Start Year</label><select className={sel} value={exp.startYear} onChange={e => setExp(i, "startYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                    {!exp.current && (<>
                      <div><label className={lbl}>End Month</label><select className={sel} value={exp.endMonth} onChange={e => setExp(i, "endMonth", e.target.value)}><option value="">Month</option>{MONTHS.map(m => <option key={m}>{m}</option>)}</select></div>
                      <div><label className={lbl}>End Year</label><select className={sel} value={exp.endYear} onChange={e => setExp(i, "endYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                    </>)}
                  </div>
                  <div><label className={lbl}>Achievements / Responsibilities</label>
                    <textarea className={`${inp} resize-none`} rows={4} value={exp.description} onChange={e => setExp(i, "description", e.target.value)} placeholder={"• Led redesign of checkout flow, reducing drop-off by 32%\n• Built internal design system used by 8 teams"} />
                  </div>
                </div>
              ))}
              <button onClick={() => setForm(f => ({ ...f, experience: [...f.experience, { ...EMPTY_EXPERIENCE }] }))} className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"><Plus className="h-4 w-4" /> Add Another Position</button>
            </div>
          )}

          {/* STEP 3: Education */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Education</h2>
              {form.education.map((edu, i) => (
                <div key={i} className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-3 relative">
                  {form.education.length > 1 && <button onClick={() => setForm(f => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }))} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><label className={lbl}>Degree / Qualification</label><input className={inp} value={edu.degree} onChange={e => setEdu(i, "degree", e.target.value)} placeholder="B.Tech Computer Science" /></div>
                    <div><label className={lbl}>Institution</label><input className={inp} value={edu.institution} onChange={e => setEdu(i, "institution", e.target.value)} placeholder="Delhi University" /></div>
                    <div><label className={lbl}>Location</label><input className={inp} value={edu.location} onChange={e => setEdu(i, "location", e.target.value)} placeholder="City, Country" /></div>
                    <div><label className={lbl}>Grade / GPA</label><input className={inp} value={edu.grade || ""} onChange={e => setEdu(i, "grade", e.target.value)} placeholder="8.5 CGPA" /></div>
                    <div><label className={lbl}>Start Year</label><select className={sel} value={edu.startYear} onChange={e => setEdu(i, "startYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                    <div><label className={lbl}>End Year</label><select className={sel} value={edu.endYear} onChange={e => setEdu(i, "endYear", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                  </div>
                </div>
              ))}
              <button onClick={() => setForm(f => ({ ...f, education: [...f.education, { ...EMPTY_EDUCATION }] }))} className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"><Plus className="h-4 w-4" /> Add Education Entry</button>
            </div>
          )}

          {/* STEP 4: Skills & Certifications */}
          {step === 4 && (
            <div className="space-y-5">
              {/* Skills */}
              <div className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-4">
                <h2 className="text-base font-bold text-white">Technical Skills</h2>
                <div className="flex gap-2">
                  <input className={inp} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(skillInput, "skills"); setSkillInput(""); }}} placeholder="e.g. React, TypeScript (Enter to add)" />
                  <button onClick={() => { addSkill(skillInput, "skills"); setSkillInput(""); }} className="px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"><Plus className="h-4 w-4" /></button>
                </div>
                {form.skills.length > 0 && <div className="flex flex-wrap gap-2">{form.skills.map(s => <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">{s}<button onClick={() => set("skills", form.skills.filter(sk => sk !== s))}><X className="h-2.5 w-2.5" /></button></span>)}</div>}
              </div>

              {/* Key Strengths */}
              <div className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-4">
                <h2 className="text-base font-bold text-white">Key Strengths</h2>
                <p className="text-zinc-400 text-xs">Leadership qualities, soft skills, and professional strengths</p>
                <div className="flex gap-2">
                  <input className={inp} value={strengthInput} onChange={e => setStrengthInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(strengthInput, "keyStrengths"); setStrengthInput(""); }}} placeholder="e.g. Team Leadership, Problem Solving (Enter)" />
                  <button onClick={() => { addSkill(strengthInput, "keyStrengths"); setStrengthInput(""); }} className="px-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition"><Plus className="h-4 w-4" /></button>
                </div>
                {(form.keyStrengths || []).length > 0 && <div className="flex flex-wrap gap-2">{(form.keyStrengths || []).map(s => <span key={s} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">{s}<button onClick={() => set("keyStrengths", (form.keyStrengths || []).filter(sk => sk !== s))}><X className="h-2.5 w-2.5" /></button></span>)}</div>}
              </div>

              {/* Certifications */}
              <div className="bg-zinc-900/10 border border-zinc-900/60 p-5 rounded-2xl space-y-4">
                <h2 className="text-base font-bold text-white">Certifications</h2>
                {(form.certifications || []).map((cert, i) => (
                  <div key={i} className="grid gap-3 sm:grid-cols-3 relative">
                    {(form.certifications || []).length > 0 && <button onClick={() => setForm(f => ({ ...f, certifications: (f.certifications || []).filter((_, idx) => idx !== i) }))} className="absolute -top-1 right-0 text-zinc-600 hover:text-rose-400"><X className="h-3.5 w-3.5" /></button>}
                    <div><label className={lbl}>Certificate Name</label><input className={inp} value={cert.name} onChange={e => setCert(i, "name", e.target.value)} placeholder="AWS Solutions Architect" /></div>
                    <div><label className={lbl}>Issuing Body</label><input className={inp} value={cert.issuer} onChange={e => setCert(i, "issuer", e.target.value)} placeholder="Amazon Web Services" /></div>
                    <div><label className={lbl}>Year</label><select className={sel} value={cert.year} onChange={e => setCert(i, "year", e.target.value)}><option value="">Year</option>{YEARS.map(y => <option key={y}>{y}</option>)}</select></div>
                  </div>
                ))}
                <button onClick={() => setForm(f => ({ ...f, certifications: [...(f.certifications || []), { ...EMPTY_CERTIFICATION }] }))} className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"><Plus className="h-4 w-4" /> Add Certification</button>
              </div>
            </div>
          )}

          {/* STEP 5: Generate */}
          {step === 5 && (
            <div className="bg-zinc-900/10 border border-zinc-900/60 p-6 rounded-2xl space-y-5">
              <h2 className="text-lg font-bold text-white">Generate & Download</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Gemini AI will rewrite your resume with impact-driven bullet points and ATS keywords.
                The PDF will match the <span className="text-white font-semibold capitalize">{templateId}</span> template shown in the live preview.
              </p>
              <Button onClick={handleGenerate} disabled={generating || !form.fullName} className="w-full py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold flex items-center justify-center gap-2 shadow-xl">
                {generating ? <><Loader2 className="h-4 w-4 animate-spin" />Gemini is crafting your resume...</> : <><Sparkles className="h-4 w-4" />Generate AI Resume</>}
              </Button>
              {generated && (
                <div className="space-y-3 pt-2 border-t border-zinc-900">
                  <p className="text-sm font-semibold text-emerald-400 flex items-center gap-2"><Check className="h-4 w-4" />Resume generated! Download it below.</p>
                  <Button onClick={() => downloadAsPDF(form.fullName)} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 py-3">
                    <Download className="h-4 w-4" /> Download PDF (matches live preview)
                  </Button>
                  <p className="text-zinc-500 text-xs text-center">Browser print dialog opens → choose "Save as PDF". The layout matches the preview on the right exactly.</p>
                </div>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="flex justify-between pt-2">
            <Button onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0} className="rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-semibold flex items-center gap-2 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            {step < STEPS.length - 1 && (
              <Button onClick={() => setStep(s => Math.min(s + 1, STEPS.length - 1))} className="rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold flex items-center gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right: Live Preview — fixed height container, inner div scaled to fill */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Live Preview · <span className="text-zinc-400 capitalize">{templateId}</span></p>
              {step === 0 && <span className="text-[10px] text-zinc-600">Showing sample data</span>}
            </div>
            {/* Container clips the overflow; inner content scaled to fit width */}
            <div className="rounded-2xl border border-zinc-800 bg-white overflow-hidden shadow-2xl" style={{ height: 580 }}>
              <div style={{ transform: "scale(0.62)", transformOrigin: "top left", width: "161%", pointerEvents: "none" }}>
                <ResumePreview data={previewData} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
