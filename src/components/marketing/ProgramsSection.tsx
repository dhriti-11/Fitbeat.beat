"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { OFFER_ITEMS } from "@/lib/constants";

export function ProgramsSection() {
  const innerRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);
  const n = OFFER_ITEMS.length;
  const step = 360 / n;
  const radius = 165;

  useEffect(() => {
    const timer = setInterval(() => setAngle((a) => a - step), 2600);
    return () => clearInterval(timer);
  }, [step]);

  return (
    <section id="programs" className="relative z-10 overflow-hidden px-7 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl"
        >
          Everything FitBeat trains you in.
        </motion.h2>
        <p className="mx-auto mt-3 max-w-xl text-[#8FA9C7]">Drag the ring or let it spin — every specialisation, program and service we offer.</p>

        <div className="relative mx-auto mt-16 h-[420px] max-w-lg" style={{ perspective: 1200 }}>
          <div
            ref={innerRef}
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{ transformStyle: "preserve-3d", transform: `rotateY(${angle}deg)` }}
          >
            {OFFER_ITEMS.map((item, i) => {
              const rot = i * step;
              const isIntro = "intro" in item && item.intro;
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-52 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl glass"
                  style={{ transform: `rotateY(${rot}deg) translateZ(${radius}px)` }}
                >
                  {!isIntro && "img" in item && (
                    <Image src={item.img!} alt={item.title} fill className="object-cover opacity-60" />
                  )}
                  <div className="relative z-10 flex h-full flex-col justify-end p-4">
                    {!isIntro && "tag" in item && (
                      <span className="font-[family-name:var(--font-space)] text-[10px] uppercase text-[#4FA3FF]">{item.tag}</span>
                    )}
                    <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold">{item.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => setAngle((a) => a + step)} className="glass rounded-full px-4 py-2 text-sm">‹</button>
          <button onClick={() => setAngle((a) => a - step)} className="glass rounded-full px-4 py-2 text-sm">›</button>
        </div>
      </div>
    </section>
  );
}
