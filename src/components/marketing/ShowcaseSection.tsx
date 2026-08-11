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
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.96]);

  return (
    <section id="showcase" ref={ref} className="relative z-10 py-20 md:py-32">
      <div className="mx-auto mb-10 max-w-7xl px-6 md:px-10">
        <SectionLabel>The Studio In Motion</SectionLabel>
        <h2 className="section-heading max-w-3xl">
          Watch FitBeat
          <span className="text-[#F5821F]"> Ignite.</span>
        </h2>
      </div>

      <motion.div style={{ scale }} className="relative mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="forge-frame relative overflow-hidden">
          <video
            src={MEDIA.heroVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="aspect-[21/9] w-full object-cover md:aspect-[2.4/1]"
            id="showcaseVideo"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1a]/60 via-transparent to-[#060e1a]/40" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between md:bottom-10 md:left-10 md:right-10">
            <div>
              <p className="font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.25em] text-[#4FA3FF]">
                Real Sessions · Real Trainers
              </p>
              <p className="mt-2 font-[family-name:var(--font-condensed)] text-2xl uppercase md:text-4xl">
                Press play. Feel the studio.
              </p>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="rounded-full border border-white/20 bg-black/40 px-5 py-2.5 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest backdrop-blur-md transition hover:border-[#F5821F]"
            >
              {muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
