import React from "react";
import { getCoverLetters } from "@/actions/cover-letter";
import CoverLetterDashboard from "./CoverLetterDashboard";

export default async function CoverLetterPage() {
  const letters = await getCoverLetters();

  // Map Date objects to keep them serializable if needed
  const serializedLetters = letters.map((letter) => ({
    id: letter.id,
    companyName: letter.companyName,
    jobTitle: letter.jobTitle,
    content: letter.content,
    createdAt: letter.createdAt,
  }));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CoverLetterDashboard initialLetters={serializedLetters} />
      </main>
    </div>
  );
}
