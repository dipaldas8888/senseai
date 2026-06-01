"use server";

import { prisma as db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCoverLetter(data: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const apiKey = process.env.GEMINI_API_KEY;
  let letterContent = "";

  if (apiKey) {
    try {
      const prompt = `
You are an expert career coach and executive resume writer. Write a highly tailored, professional, and compelling cover letter for:
Role: ${data.jobTitle}
Company: ${data.companyName}
Job Description: ${data.jobDescription}

Use a modern, professional, and engaging tone. Align the applicant's profile (skills and experience) implicitly with the requirements listed in the job description. Structure the letter with standard business formatting:
1. Salutation
2. Opening hook (expressing high interest and alignment with the company's goals)
3. Body paragraphs (highlighting key achievements, problem-solving abilities, and relevant skills matching the description)
4. Call to action / closing statement
5. Professional sign-off

Respond with the cover letter content ONLY. Do not include markdown headers, subject lines, or template placeholders (like [Your Name] - write a clean layout that the user can immediately use).
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const json = await response.json();
        letterContent = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
      } else {
        const errText = await response.text();
        console.error("Gemini API Error details:", errText);
        throw new Error("Gemini API failed to generate cover letter");
      }
    } catch (e: any) {
      console.error("Gemini Cover Letter Error:", e);
      letterContent = `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. Based on my background in the industry, I am confident in my ability to make an immediate, positive impact on your team.\n\nI look forward to discussing how my experience aligns with your current goals.\n\nSincerely,\n[Your Name]`;
    }
  } else {
    letterContent = `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${data.jobTitle} position at ${data.companyName}. Based on my background in the industry, I am confident in my ability to make an immediate, positive impact on your team.\n\nI look forward to discussing how my experience aligns with your current goals.\n\nSincerely,\n[Your Name]`;
  }

  try {
    const coverLetter = await db.coverLetter.create({
      data: {
        userId: user.id,
        content: letterContent.trim(),
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        status: "completed",
      },
    });

    revalidatePath("/cover-letter");
    return coverLetter;
  } catch (error: any) {
    console.error("Database Save Error:", error);
    throw new Error("Failed to save cover letter to database");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) return [];

  return await db.coverLetter.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCoverLetter(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const letter = await db.coverLetter.findUnique({
    where: { id },
  });

  if (!letter || letter.userId !== user.id) {
    throw new Error("Cover letter not found or unauthorized");
  }

  return letter;
}

export async function updateCoverLetter(id: string, content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const letter = await db.coverLetter.findUnique({
    where: { id },
  });

  if (!letter || letter.userId !== user.id) {
    throw new Error("Cover letter not found or unauthorized");
  }

  const updated = await db.coverLetter.update({
    where: { id },
    data: { content },
  });

  revalidatePath(`/cover-letter/${id}`);
  return updated;
}

export async function deleteCoverLetter(id: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  const letter = await db.coverLetter.findUnique({
    where: { id },
  });

  if (!letter || letter.userId !== user.id) {
    throw new Error("Cover letter not found or unauthorized");
  }

  await db.coverLetter.delete({
    where: { id },
  });

  revalidatePath("/cover-letter");
  return { success: true };
}
