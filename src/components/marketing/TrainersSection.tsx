"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TRAINERS } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function TrainersSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="trainers" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel>The Coaches</SectionLabel>
        <h2 className="section-heading max-w-2xl">
          Meet The
          <span className="text-[#F5821F]"> Trainers.</span>
        </h2>
        <p className="mt-6 max-w-xl text-[#8FA9C7]">
          Certified, hands-on coaches who review your progress every week — not from a template, from your actual body.
        </p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {TRAINERS.map((t, i) => (
            <motion.button
              key={t.email}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className="forge-frame group relative aspect-[3/4] overflow-hidden text-left transition duration-500 hover:border-[#F5821F]/40"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E6FD9]/40 via-[#0a1628] to-[#F5821F]/30 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-[family-name:var(--font-condensed)] text-[120px] leading-none text-white/10 transition group-hover:text-white/20">
                  {t.initials}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-[#060e1a]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.2em] text-[#4FA3FF]">
                  ✓ Certified
                </span>
                <h3 className="mt-2 font-[family-name:var(--font-condensed)] text-3xl uppercase leading-none">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm text-[#8FA9C7]">{t.role}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm" onClick={() => setActive(null)}>
          <div className="forge-frame max-w-md p-8 md:p-10" onClick={(e) => e.stopPropagation()}>
            <span className="font-[family-name:var(--font-condensed)] text-6xl text-[#F5821F]">{TRAINERS[active].initials}</span>
            <h3 className="mt-4 font-[family-name:var(--font-condensed)] text-4xl uppercase">{TRAINERS[active].name}</h3>
            <p className="mt-2 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest text-[#4FA3FF]">
              {TRAINERS[active].role}
            </p>
            <p className="mt-6 leading-relaxed text-[#8FA9C7]">{TRAINERS[active].bio}</p>
            <button onClick={() => setActive(null)} className="mt-8 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest text-[#F5821F]">
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
