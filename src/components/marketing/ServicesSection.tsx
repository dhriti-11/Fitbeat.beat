"use client";

import { motion } from "framer-motion";
import { SERVICES, PRICING_TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function ServicesSection() {
  return (
    <>
      <section id="services" className="relative z-10 px-7 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl">Training built around your body.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass rounded-3xl p-6"
              >
                <h3 className="font-[family-name:var(--font-syne)] text-lg">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8FA9C7]">{s.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 px-7 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-4xl md:text-5xl">Choose your rhythm.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-3xl p-8 ${tier.featured ? "ring-2 ring-[#F5821F]/50" : ""}`}
              >
                {tier.featured && (
                  <span className="rounded-full bg-[#F5821F]/20 px-3 py-1 text-xs text-[#FFA94D]">Most Popular</span>
                )}
                <h3 className="mt-2 font-[family-name:var(--font-syne)] text-2xl">{tier.name}</h3>
                <p className="mt-2 text-3xl font-bold grad-text">{tier.price}</p>
                <ul className="mt-6 space-y-2 text-sm text-[#8FA9C7]">
                  {tier.features.map((f) => (
                    <li key={f}>✓ {f}</li>
                  ))}
                </ul>
                <Button href="#book" variant={tier.featured ? "grad" : "ghost"} className="mt-6 w-full">
                  Contact Trainer
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
