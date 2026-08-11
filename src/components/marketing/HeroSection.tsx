"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { HeroSceneWrapper } from "@/components/three/HeroSceneWrapper";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { BRANCHES } from "@/lib/constants";
import { MEDIA } from "@/lib/media";

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] overflow-hidden pt-28 md:pt-32">
      <HeroSceneWrapper />
      <div className="hero-glow pointer-events-none absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-[#F5821F]/20 blur-[120px]" />
      <div className="hero-glow pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-[#1E6FD9]/25 blur-[100px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-6">
        <div className="lg:pb-20">
          <SectionLabel>Premium Live Coaching · Kuwait · Qatar · Morbi</SectionLabel>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title font-[family-name:var(--font-condensed)] uppercase leading-[0.88] tracking-tight"
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
            className="mt-8 max-w-md text-base leading-relaxed text-[#8FA9C7] md:text-lg"
          >
            Cinematic coaching for women, teen girls and kids — live classes, custom nutrition, and honest progress tracking with real trainers who know your name.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Button href="/sign-in" size="lg" variant="gold">
              Start Free
            </Button>
            <Button href="#showcase" size="lg" variant="ghost">
              Watch Studio
            </Button>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-2">
            {BRANCHES.map((b) => (
              <span key={b.city} className="forge-pill">
                {b.city}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="relative"
        >
          <div className="forge-frame relative aspect-[4/5] overflow-hidden md:aspect-[3/4]">
            <video
              src={MEDIA.heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.25em] text-[#F5821F]">
                Live In Motion
              </p>
              <p className="mt-2 font-[family-name:var(--font-condensed)] text-3xl uppercase leading-none md:text-4xl">
                Real Sessions.
                <br />
                Real Energy.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 border border-[#F5821F]/40 md:block" />
          <div className="absolute -right-4 -top-4 hidden h-16 w-16 bg-[#1E6FD9]/30 md:block" />
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl border-t border-white/10 px-6 py-8 md:px-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
          {[
            { n: "1,200+", l: "Members Trained" },
            { n: "6", l: "Expert Trainers" },
            { n: "94%", l: "Goal Completion" },
            { n: "4.9", l: "Client Rating" },
          ].map((s) => (
            <div key={s.l} className="forge-stat px-0 md:px-8 md:first:pl-0">
              <div className="font-[family-name:var(--font-condensed)] text-5xl leading-none text-white md:text-6xl">
                {s.n}
              </div>
              <div className="mt-2 font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.2em] text-[#8FA9C7]">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
