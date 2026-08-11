"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { HeroSceneWrapper } from "@/components/three/HeroSceneWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRANCHES } from "@/lib/constants";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden pt-24 sm:pt-28 md:pt-36">
      <HeroSceneWrapper />
      <div className="pointer-events-none absolute -right-32 top-20 hidden h-[500px] w-[500px] rounded-full bg-[#F5821F]/20 blur-[120px] md:block" />
      <div className="pointer-events-none absolute -left-20 bottom-0 hidden h-[400px] w-[400px] rounded-full bg-[#1E6FD9]/25 blur-[100px] md:block" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-12 sm:px-6 sm:pb-16 md:px-10"
      >
        <SectionLabel>Premium Live Coaching · Kuwait · Qatar · Morbi</SectionLabel>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="hero-title font-[family-name:var(--font-display)] uppercase leading-[0.9] tracking-tight"
        >
          Find Your
          <br />
          <span className="text-[#F5821F]">Beat.</span>
          <br />
          Train Every
          <br />
          Day.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mt-6 max-w-xl text-sm font-semibold leading-relaxed text-[#a8bdd4] sm:mt-8 sm:text-base md:text-lg"
        >
          Live coaching for women, teen girls and kids — custom nutrition, honest progress tracking, and trainers who know your name.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4"
        >
          <Button href="/sign-up" size="lg" variant="gold" className="w-full sm:w-auto">
            Sign Up Free
          </Button>
          <Button href="/sign-in" size="lg" variant="ghost" className="w-full sm:w-auto">
            Sign In
          </Button>
          <Button href="#showcase" size="lg" variant="ghost" className="w-full sm:w-auto">
            Watch Studio
          </Button>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2 sm:mt-10">
          {BRANCHES.map((b) => (
            <span key={b.city} className="forge-pill">
              {b.city}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-4 py-6 sm:px-6 sm:py-8 md:px-10">
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
          {[
            { n: "1,200+", l: "Members Trained" },
            { n: "6", l: "Expert Trainers" },
            { n: "94%", l: "Goal Completion" },
            { n: "4.9", l: "Client Rating" },
          ].map((s) => (
            <div key={s.l} className="forge-stat px-0 md:px-8 md:first:pl-0">
              <div className="font-[family-name:var(--font-display)] text-3xl leading-none text-white sm:text-5xl md:text-6xl">
                {s.n}
              </div>
              <div className="mt-1 font-[family-name:var(--font-accent)] text-[10px] font-bold uppercase tracking-[0.12em] text-[#a8bdd4] sm:mt-2 sm:text-xs">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
