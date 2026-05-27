"use client";

import Link from "next/link";
import Image from "next/image";
import DarkVeil from "./DarkVeil";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  const translateY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div className="relative w-full min-h-[650px] md:min-h-[750px] flex flex-col justify-start items-center overflow-hidden bg-black pt-32 md:pt-36">
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={265}
          noiseIntensity={0.015}
          scanlineIntensity={0.12}
          speed={0.3}
          scanlineFrequency={3.0}
          warpAmount={0.25}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,black_90%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-10xl px-4 text-center flex flex-col items-center gap-7">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl md:text-8xl max-w-7xl leading-[1.1] mb-6"
        >
          Your AI Career Coach for Professional Success
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl leading-relaxed mb-10"
        >
          Advance your career with personalized guidance, interview prep, and
          AI-powered tools for job success.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="px-8 py-3.5 bg-white text-zinc-950 font-bold rounded-lg hover:bg-zinc-200 transition-all duration-200 shadow-xl shadow-white/5 active:scale-95"
          >
            Get Started
          </Link>
        </motion.div>

        <motion.div
          ref={containerRef}
          style={{
            rotateX,
            scale,
            opacity,
            y: translateY,
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
          className="w-full max-w-7xl mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/20 p-2 overflow-hidden shadow-[0_0_50px_0_rgba(99,102,241,0.15)] origin-top transition-all duration-300 ease-out"
        >
          <Image
            src="/banner.jpeg"
            className="object-cover rounded-xl w-full h-auto border border-zinc-900"
            width={1300}
            height={700}
            alt="banner"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
