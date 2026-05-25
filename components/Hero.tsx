"use client";

import Link from "next/link";
import Image from "next/image";
import DarkVeil from "./DarkVeil";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the banner container relative to the viewport.
  // "start end" means start tracking when the top of the element hits the bottom of the viewport.
  // "end end" means finish tracking when the bottom of the element reaches the bottom of the viewport.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Map the 0-1 scroll progress to custom CSS values:
  // 1. rotateX: starts tilted backward at 20 degrees, rotates flat to 0 degrees as it enters the view.
  const rotateX = useTransform(scrollYProgress, [0, 1], [20, 0]);
  // 2. scale: starts at 0.93 scale, scales up to 1.0 (full size).
  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  // 3. opacity: starts semi-transparent (0.6), goes to full opacity (1.0).
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);
  // 4. y: adds a subtle vertical rise animation as the user scrolls.
  const translateY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <div className="relative w-full min-h-[650px] md:min-h-[750px] flex flex-col justify-start items-center overflow-hidden bg-black pt-32 md:pt-36">
      {/* Background WebGL Shader waves */}
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

      {/* Content overlay using motion for smooth initial load animations */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center flex flex-col items-center gap-7">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-extrabold tracking-tighter text-white sm:text-7xl md:text-8xl max-w-5xl leading-[1.1] mb-6"
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

        {/* 3D Scroll-Linked Animated Banner Container */}
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
          className="w-full max-w-[1200px] mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/20 p-2 overflow-hidden shadow-[0_0_50px_0_rgba(99,102,241,0.15)] origin-top transition-all duration-300 ease-out"
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
