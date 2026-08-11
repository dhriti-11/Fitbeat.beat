"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TRAINERS } from "@/lib/constants";

export function TrainersSection() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="trainers" className="relative z-10 px-7 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl">Meet our certified trainers.</h2>
        <p className="mt-3 max-w-xl text-[#8FA9C7]">Every FitBeat coach is certified, hands-on, and personally reviews your progress every week.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TRAINERS.map((t, i) => (
            <motion.button
              key={t.email}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActive(i)}
              className="glass rounded-3xl p-6 text-left transition hover:border-[#4FA3FF]/40"
            >
              <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6FD9] to-[#F5821F] font-[family-name:var(--font-syne)] text-2xl font-bold">
                {t.initials}
                <span className="absolute -bottom-1 rounded-full bg-[#38BDF8] px-2 py-0.5 text-[10px]">✓ Certified</span>
              </div>
              <h3 className="text-lg font-bold">{t.name}</h3>
              <p className="mt-1 text-sm text-[#4FA3FF]">{t.role}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-6" onClick={() => setActive(null)}>
          <div className="glass max-w-md rounded-3xl p-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1E6FD9] to-[#F5821F] text-xl font-bold">
              {TRAINERS[active].initials}
            </div>
            <h3 className="text-xl font-bold">{TRAINERS[active].name}</h3>
            <p className="text-sm text-[#4FA3FF]">{TRAINERS[active].role}</p>
            <p className="mt-4 text-[#8FA9C7]">{TRAINERS[active].bio}</p>
            <button onClick={() => setActive(null)} className="mt-6 text-sm text-[#4FA3FF]">Close</button>
          </div>
        </div>
      )}
    </section>
  );
}
