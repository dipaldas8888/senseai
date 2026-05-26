import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Zap, Shield, Cpu } from "lucide-react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Immersive Hero Section spanning full viewport height */}
      <Hero />

      <Features />
    </div>
  );
}
