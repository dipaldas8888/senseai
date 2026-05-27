import React from "react";
import { testimonial } from "../data/testimonial";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-24 relative z-10 border-t border-zinc-900 bg-zinc-950/10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Loved by Professionals
        </h2>
        <p className="mt-4 text-zinc-400 text-lg">
          Discover how builders and job seekers are landing dream roles with Sensai.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {testimonial.map((item, index) => (
          <Card
            key={index}
            className="border-zinc-900 bg-zinc-900/10 backdrop-blur-sm hover:border-zinc-800 transition-all hover:bg-zinc-900/20 duration-300 group flex flex-col justify-between py-6"
          >
            <CardContent className="flex flex-col h-full justify-between gap-6">
              <div className="relative">
                <span className="text-5xl text-indigo-500/20 font-serif absolute -top-4 -left-2 select-none">“</span>
                <p className="text-zinc-200 text-base italic leading-relaxed relative z-10 pt-2 pl-4">
                  {item.quote}
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-zinc-900/60 pt-4">
                <img
                  src={item.image}
                  alt={item.author}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border border-zinc-850 object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {item.author}
                  </h4>
                  <p className="text-xs text-zinc-400">
                    {item.role} @ <span className="text-zinc-500">{item.company}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

