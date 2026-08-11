"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { OFFER_ITEMS } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ProgramsSection() {
  const [angle, setAngle] = useState(0);
  const items = OFFER_ITEMS.filter((item) => !("intro" in item && item.intro));
  const n = items.length;
  const step = 360 / n;
  const radius = 180;

  useEffect(() => {
    const timer = setInterval(() => setAngle((a) => a - step), 2800);
    return () => clearInterval(timer);
  }, [step]);

  return (
    <section id="programs" className="relative z-10 overflow-hidden border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel>Programs & Services</SectionLabel>
            <h2 className="section-heading">
              Everything
              <br />
              <span className="text-[#F5821F]">We Train.</span>
            </h2>
            <p className="mt-6 max-w-md text-[#8FA9C7]">
              Weight loss, strength, HIIT, yoga, nutrition — spin the ring or use the controls to explore every program FitBeat offers.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setAngle((a) => a + step)}
                className="forge-frame px-5 py-2.5 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest hover:border-[#F5821F]/50"
              >
                Prev
              </button>
              <button
                onClick={() => setAngle((a) => a - step)}
                className="forge-frame px-5 py-2.5 font-[family-name:var(--font-space)] text-xs uppercase tracking-widest hover:border-[#F5821F]/50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="relative mx-auto h-[460px] w-full max-w-md" style={{ perspective: 1400 }}>
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{ transformStyle: "preserve-3d", transform: `rotateY(${angle}deg)` }}
            >
              {items.map((item, i) => {
                const rot = i * step;
                if (!("img" in item)) return null;
                return (
                  <div
                    key={item.title}
                    className="forge-frame absolute left-1/2 top-1/2 h-56 w-44 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
                    style={{ transform: `rotateY(${rot}deg) translateZ(${radius}px)` }}
                  >
                    <Image src={item.img!} alt={item.title} fill className="object-cover opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      {"tag" in item && (
                        <span className="font-[family-name:var(--font-space)] text-[9px] uppercase tracking-widest text-[#F5821F]">
                          {item.tag}
                        </span>
                      )}
                      <h3 className="font-[family-name:var(--font-condensed)] text-xl uppercase leading-tight">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
