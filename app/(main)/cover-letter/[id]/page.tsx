import React from "react";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterEditor from "./CoverLetterEditor";
import { notFound } from "next/navigation";

type Params = Promise<{ id: string }>;

export default async function CoverLetterDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

  try {
    const letter = await getCoverLetter(id);

    if (!letter) {
      notFound();
    }

    const serializedLetter = {
      id: letter.id,
      companyName: letter.companyName,
      jobTitle: letter.jobTitle,
      content: letter.content,
      jobDescription: letter.jobDescription,
    };

    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-20">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <CoverLetterEditor initialLetter={serializedLetter} />
        </main>
      </div>
    );
  } catch (error) {
    console.error("Failed to load cover letter page detail:", error);
    notFound();
  }
}
