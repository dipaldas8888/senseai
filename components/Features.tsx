import React from "react";
import { features } from "../data/features";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Features = () => {
  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 relative z-10 border-t border-zinc-900 bg-zinc-950/20">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Built for Modern Professionals
        </h2>
        <p className="mt-4 text-zinc-400 text-lg">
          AI-powered tools and real-time guidance to accelerate your career trajectory.
        </p>
      </div>

      {/* 4-Column Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card 
            key={index}
            className="border-zinc-900 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-900/20 duration-300 group hover:-translate-y-1"
          >
            <CardHeader className="pb-2">
              <div className="text-indigo-400 transition-all duration-300 group-hover:text-indigo-300 w-fit">
                {feature.icon}
              </div>
              <CardTitle className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
