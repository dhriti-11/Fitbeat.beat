"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroSceneWrapper } from "@/components/three/HeroSceneWrapper";
import { BRANCHES } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-7 pb-20 pt-36">
      <HeroSceneWrapper />
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest text-[#4FA3FF]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#F5821F]" />
          Live Coaching · Trainer-Led · Kuwait · Qatar · Morbi
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl text-[clamp(2.5rem,8vw,6rem)]"
        >
          FIND YOUR BEAT.
          <br />
          <span className="grad-text">TRAIN TO IT</span> EVERY DAY.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 max-w-lg text-lg text-[#8FA9C7]"
        >
          FitBeat pairs you with a real, dedicated trainer — live classes, custom diet plans and honest progress tracking for women, teens and kids.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <Button href="/sign-in">Get Started — It&apos;s Free</Button>
          <Button href="#trainers" variant="ghost">
            Meet the Trainers
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {BRANCHES.map((b) => (
            <span
              key={b.city}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-[family-name:var(--font-space)] text-xs text-[#8FA9C7]"
            >
              {b.city}, {b.country}
            </span>
          ))}
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { n: "1,200+", l: "Members Trained" },
            { n: "6", l: "Expert Trainers" },
            { n: "94%", l: "Goal Completion" },
            { n: "4.9/5", l: "Client Rating" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass rounded-2xl p-4 text-center"
            >
              <div className="font-[family-name:var(--font-syne)] text-2xl font-bold grad-text">{s.n}</div>
              <div className="mt-1 text-xs text-[#8FA9C7]">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
