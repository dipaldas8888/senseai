import React from "react";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  // If the user has already completed onboarding, redirect directly to dashboard
  const { isOnboarded } = await getUserOnboardingStatus();
  
  if (isOnboarded) {
    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center py-10 min-h-[calc(100vh-6rem)]">
      <OnboardingForm />
    </div>
  );
}
