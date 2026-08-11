"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MEDIA } from "@/lib/media";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ShowcaseSection() {
  const [muted, setMuted] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section id="showcase" ref={ref} className="relative z-10 py-16 sm:py-20 md:py-32">
      <div className="mx-auto mb-8 max-w-7xl px-4 sm:mb-10 sm:px-6 md:px-10">
        <SectionLabel>The Studio In Motion</SectionLabel>
        <h2 className="section-heading max-w-3xl">
          Watch FitBeat
          <span className="text-[#F5821F]"> Ignite.</span>
        </h2>
      </div>

      <motion.div style={{ scale }} className="relative mx-auto max-w-[1400px] px-4 sm:px-6 md:px-8">
        <div className="forge-frame relative overflow-hidden">
          <video
            src={MEDIA.heroVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="aspect-video w-full object-cover md:aspect-[2.4/1]"
            id="showcaseVideo"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a]/70 via-transparent to-[#060e1a]/30" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6 md:bottom-10 md:left-10 md:right-10 md:p-0">
            <div>
              <p className="font-[family-name:var(--font-accent)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#4FA3FF] sm:text-xs">
                Real Sessions · Real Trainers
              </p>
              <p className="mt-1 font-[family-name:var(--font-display)] text-lg uppercase sm:mt-2 sm:text-2xl md:text-4xl">
                Press play. Feel the studio.
              </p>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="w-fit shrink-0 border border-white/20 bg-black/50 px-4 py-2 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest backdrop-blur-md transition hover:border-[#F5821F] sm:px-5 sm:py-2.5"
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
