"use client";

import { motion } from "framer-motion";
import { SERVICES, PRICING_TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useIsMobile } from "@/lib/useMediaQuery";

export function ServicesSection() {
  const isMobile = useIsMobile();

  return (
    <>
      <section id="services" className="relative z-10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionLabel>What You Get</SectionLabel>
          <h2 className="section-heading max-w-2xl">
            Training Built
            <span className="text-[#F5821F]"> Around You.</span>
          </h2>

          <div className="mt-16 pb-[30vh] md:pb-[40vh]">
            {SERVICES.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06 }}
                className="stacked-card flex flex-col gap-4 rounded-none p-6 sm:gap-6 sm:p-8 md:flex-row md:items-center md:gap-12 md:p-10"
                style={{
                  zIndex: i + 1,
                  top: `calc(${isMobile ? "4.5rem" : "6rem"} + ${i * (isMobile ? 0.75 : 1)}rem)`,
                }}
              >
                <span className="font-[family-name:var(--font-display)] text-7xl leading-none text-white/10 md:text-8xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-[family-name:var(--font-display)] text-xl uppercase tracking-wide text-white sm:text-3xl md:text-4xl">
                    {s.t}
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#a8bdd4] md:text-base">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="text-center">
            <SectionLabel>Membership</SectionLabel>
            <h2 className="section-heading">
              Choose Your <span className="text-[#4FA3FF]">Rhythm.</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
            {PRICING_TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`forge-frame flex flex-col p-8 md:p-10 ${
                  tier.featured ? "border-[#F5821F]/50 bg-gradient-to-b from-[#F5821F]/10 to-transparent" : ""
                }`}
              >
                {tier.featured && (
                  <span className="mb-4 inline-block w-fit border border-[#F5821F]/40 px-3 py-1 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-[0.2em] text-[#FFA94D]">
                    Most Popular
                  </span>
                )}
                <h3 className="font-[family-name:var(--font-display)] text-4xl uppercase">{tier.name}</h3>
                <p className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[#F5821F]">{tier.price}</p>
                <ul className="mt-8 flex-1 space-y-3 text-sm text-[#8FA9C7]">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="text-[#F5821F]">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button href="#book" variant="gold" className="mt-8 w-full">
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
