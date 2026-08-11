"use client";

import { motion } from "framer-motion";
import { BRANCHES } from "@/lib/constants";

export function BranchesSection() {
  return (
    <section id="branches" className="relative z-10 px-7 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl">Our offline studios.</h2>
        <p className="mt-3 max-w-xl text-[#8FA9C7]">FitBeat branches across Kuwait, Qatar and Morbi — with more coming soon.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {BRANCHES.map((b, i) => (
            <motion.div
              key={b.city}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass overflow-hidden rounded-3xl"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#1E6FD9]/30 to-[#F5821F]/30">
                <span className="font-[family-name:var(--font-syne)] text-4xl font-bold opacity-30">{b.city[0]}</span>
              </div>
              <div className="p-6">
                <h3 className="font-[family-name:var(--font-syne)] text-xl">{b.city}</h3>
                <p className="text-sm text-[#4FA3FF]">{b.country}</p>
                <p className="mt-2 text-sm text-[#8FA9C7]">{b.address}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
