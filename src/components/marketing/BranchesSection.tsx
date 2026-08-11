"use client";

import { motion } from "framer-motion";
import { BRANCHES } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function BranchesSection() {
  return (
    <section id="branches" className="relative z-10 border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel>Offline Studios</SectionLabel>
        <h2 className="section-heading max-w-xl">
          Our Global
          <span className="text-[#4FA3FF]"> Branches.</span>
        </h2>
        <p className="mt-6 max-w-xl text-[#8FA9C7]">Kuwait, Qatar and Morbi — real studios, real community, same FitBeat energy.</p>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={b.city}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="forge-frame group overflow-hidden"
            >
              <div className="relative flex h-48 items-end overflow-hidden bg-gradient-to-br from-[#1E6FD9]/20 to-[#F5821F]/20 p-6">
                <span className="font-[family-name:var(--font-condensed)] text-[100px] leading-none text-white/5 transition group-hover:text-white/10">
                  {b.city.slice(0, 3).toUpperCase()}
                </span>
              </div>
              <div className="border-t border-white/10 p-6">
                <h3 className="font-[family-name:var(--font-condensed)] text-3xl uppercase">{b.city}</h3>
                <p className="mt-1 font-[family-name:var(--font-space)] text-[10px] uppercase tracking-widest text-[#F5821F]">
                  {b.country}
                </p>
                <p className="mt-3 text-sm text-[#8FA9C7]">{b.address}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
