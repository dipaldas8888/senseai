import React from "react";
import { faqs } from "../data/faqs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQs = () => {
  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 relative z-10 border-t border-zinc-900 bg-zinc-950/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-zinc-400 text-lg">
          Find answers to common questions about Sensai's career development platform.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="border-zinc-900 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-all duration-300 hover:bg-zinc-900/20 group"
          >
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <HelpCircle className="w-6 h-6 text-indigo-500/80 shrink-0 mt-0.5 group-hover:text-indigo-400 transition-colors" />
              <CardTitle className="text-base sm:text-lg font-bold text-zinc-100 group-hover:text-white transition-colors leading-snug">
                {faq.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-14">
              <CardDescription className="text-zinc-400 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                {faq.answer}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FAQs;

