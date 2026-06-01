"use server";

import { prisma as db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkExperience {
  jobTitle: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  current: boolean;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  targetRole?: string;
  targetJobDescription?: string;
}

// ─── Internal helper: build raw text from form data ───────────────────────────

function buildResumeText(data: ResumeFormData): string {
  const lines: string[] = [];

  lines.push(data.fullName.toUpperCase());
  const contact = [data.email, data.phone, data.location, data.linkedin, data.website]
    .filter(Boolean)
    .join(" | ");
  lines.push(contact);
  lines.push("");

  if (data.summary) {
    lines.push("SUMMARY");
    lines.push(data.summary);
    lines.push("");
  }

  if (data.skills.length > 0) {
    lines.push("SKILLS");
    lines.push(data.skills.join(" • "));
    lines.push("");
  }

  if (data.experience.length > 0) {
    lines.push("EXPERIENCE");
    for (const exp of data.experience) {
      const period = exp.current
        ? `${exp.startMonth} ${exp.startYear} – Present`
        : `${exp.startMonth} ${exp.startYear} – ${exp.endMonth} ${exp.endYear}`;
      lines.push(`${exp.jobTitle} | ${exp.company} | ${exp.location} | ${period}`);
      if (exp.description) lines.push(exp.description);
      lines.push("");
    }
  }

  if (data.education.length > 0) {
    lines.push("EDUCATION AND TRAINING");
    for (const edu of data.education) {
      const period = `${edu.startYear} – ${edu.endYear}`;
      lines.push(`${edu.degree} | ${edu.institution} | ${edu.location} | ${period}`);
      if (edu.grade) lines.push(`Grade: ${edu.grade}`);
      lines.push("");
    }
  }

  return lines.join("\n");
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return null;

  return await db.resume.findUnique({ where: { userId: user.id } });
}

export async function saveResume(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const existingResume = await db.resume.findUnique({ where: { userId: user.id } });

  let resume;
  if (existingResume) {
    resume = await db.resume.update({ where: { userId: user.id }, data: { content } });
  } else {
    resume = await db.resume.create({ data: { userId: user.id, content } });
  }

  revalidatePath("/resume");
  return resume;
}

export async function generateResume(formData: ResumeFormData): Promise<{ content: string }> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const rawText = buildResumeText(formData);
  const apiKey = process.env.GEMINI_API_KEY;
  let finalContent = rawText;

  if (apiKey) {
    try {
      const prompt = `You are an expert resume writer and career coach. Based on the following structured resume data, write a professional, ATS-optimized resume in clean plain text format.

Input Data:
---
${rawText}
---
${formData.targetJobDescription ? `Target Job Description:\n---\n${formData.targetJobDescription}\n---\n` : ""}

Rules:
1. Keep standard resume sections: Summary, Skills, Experience, Education
2. Rewrite bullet points to be impact-driven with action verbs and quantified results where possible
3. Optimize keywords for ATS matching based on the role/description
4. Use clean plain text only — no markdown, no symbols like ** or ##
5. Keep the name and contact info at the top exactly as provided
6. Each experience entry should have 3-5 bullet points starting with "• "
7. Output ONLY the resume text, nothing else`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) finalContent = text.trim();
      }
    } catch (e) {
      console.error("Gemini resume generation error:", e);
    }
  }

  await db.resume.upsert({
    where: { userId: user.id },
    update: { content: finalContent },
    create: { userId: user.id, content: finalContent },
  });

  revalidatePath("/resume");
  return { content: finalContent };
}

export async function analyzeResume(content: string, targetJobDescription?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const apiKey = process.env.GEMINI_API_KEY;
  let analysisResult = {
    atsScore: 70,
    summary:
      "The resume covers standard professional information but lacks keyword optimization and clear impact metrics.",
    strengths: ["Clear structure", "Identified key technologies"],
    weaknesses: [
      "Lacks quantifiable achievements (e.g. percentages, values)",
      "Keyword density could be improved",
    ],
    missingKeywords: ["Agile Methodologies", "CI/CD Pipelines", "System Architecture"],
    actionItems: [
      "Add specific achievements with numeric results",
      "Include more skills from the target job description",
    ],
  };

  if (apiKey) {
    try {
      const prompt = `You are an expert ATS parser and technical recruiter. Analyze the following resume:
---
${content}
---
${targetJobDescription ? `Target Job Description:\n---\n${targetJobDescription}\n---\n` : ""}

Respond with ONLY a valid JSON object:
{
  "atsScore": number,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "missingKeywords": string[],
  "actionItems": string[]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          analysisResult = {
            atsScore: parsed.atsScore || 70,
            summary: parsed.summary || "",
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            missingKeywords: parsed.missingKeywords || [],
            actionItems: parsed.actionItems || [],
          };
        }
      }
    } catch (e) {
      console.error("Error analyzing resume:", e);
    }
  }

  const updatedResume = await db.resume.upsert({
    where: { userId: user.id },
    update: {
      content,
      atsScore: analysisResult.atsScore,
      feedback: JSON.stringify(analysisResult),
    },
    create: {
      userId: user.id,
      content,
      atsScore: analysisResult.atsScore,
      feedback: JSON.stringify(analysisResult),
    },
  });

  revalidatePath("/resume");
  return { resume: updatedResume, feedback: analysisResult };
}

export async function parseResumeFile(formData: FormData): Promise<{ text?: string; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file uploaded" };
    }

    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return { error: "Uploaded file is empty" };
    }

    let text = "";
    if (file.name.endsWith(".pdf") || file.type === "application/pdf") {
      try {
        const pdf = require("pdf-parse/lib/pdf-parse.js");
        const res = await pdf(Buffer.from(arrayBuffer));
        text = res.text || "";
      } catch (e: any) {
        console.error("PDF parse error:", e);
        return { error: "Failed to parse PDF file: " + e.message };
      }
    } else if (
      file.name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const mammoth = require("mammoth");
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        text = result.value || "";
      } catch (e: any) {
        console.error("DOCX parse error:", e);
        return { error: "Failed to parse Word document: " + e.message };
      }
    } else if (file.name.endsWith(".txt") || file.type === "text/plain") {
      text = new TextDecoder("utf-8").decode(new Uint8Array(arrayBuffer));
    } else {
      return { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." };
    }

    const cleanedText = text.trim();
    if (!cleanedText) {
      return { error: "Could not extract any readable text from the file." };
    }

    return { text: cleanedText };
  } catch (e: any) {
    console.error("parseResumeFile error:", e);
    return { error: e.message || "An unexpected error occurred during file parsing." };
  }
}

