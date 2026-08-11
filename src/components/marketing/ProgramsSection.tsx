"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { OFFER_ITEMS } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useIsMobile } from "@/lib/useMediaQuery";

export function ProgramsSection() {
  const isMobile = useIsMobile();
  const items = OFFER_ITEMS.filter((item) => !("intro" in item && item.intro) && "img" in item);
  const n = items.length;
  const step = 360 / n;
  const radius = isMobile
    ? Math.max(150, Math.round(140 / Math.tan(Math.PI / n)))
    : Math.max(210, Math.round(200 / Math.tan(Math.PI / n)));

  const [angle, setAngle] = useState(0);
  const norm = ((-angle % 360) + 360) % 360;
  const activeIndex = Math.round(norm / step) % n;
  const activeItem = items[activeIndex];

  useEffect(() => {
    const timer = setInterval(() => setAngle((a) => a - step), 3000);
    return () => clearInterval(timer);
  }, [step]);

  function goTo(index: number) {
    setAngle(-index * step);
  }

  return (
    <section id="programs" className="relative z-10 border-t border-white/10 py-16 sm:py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
        <div className="relative z-20 max-w-3xl">
          <SectionLabel>Programs & Services</SectionLabel>
          <h2 className="section-heading">
            Everything
            <br />
            <span className="text-[#F5821F]">We Train.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm font-semibold text-[#a8bdd4] sm:mt-6 md:text-base">
            Use the arrows or let it spin — every specialisation, program and service we offer.
          </p>

          {activeItem && (
            <div className="mt-6 rounded-none border border-[#F5821F]/30 bg-[#060e1a]/90 p-4 sm:mt-8 sm:p-5">
              {"tag" in activeItem && (
                <span className="font-[family-name:var(--font-accent)] text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5821F] sm:text-xs">
                  {activeItem.tag}
                </span>
              )}
              <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold uppercase leading-tight text-white sm:text-3xl md:text-4xl">
                {activeItem.title}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <button
              onClick={() => setAngle((a) => a + step)}
              className="forge-frame px-4 py-2.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest hover:border-[#F5821F]/50 sm:px-5"
            >
              ← Prev
            </button>
            <button
              onClick={() => setAngle((a) => a - step)}
              className="forge-frame px-4 py-2.5 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-widest hover:border-[#F5821F]/50 sm:px-5"
            >
              Next →
            </button>
            <div className="flex flex-wrap gap-2">
              {items.map((item, i) => (
                <button
                  key={item.title}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${activeIndex === i ? "w-8 bg-[#F5821F]" : "w-2 bg-white/25"}`}
                  aria-label={item.title}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 overflow-hidden sm:mt-14">
          <div
            className={`relative mx-auto flex w-full items-center justify-center ${
              isMobile ? "h-[340px] max-w-sm" : "h-[400px] max-w-xl sm:h-[440px] md:h-[480px]"
            }`}
            style={{ perspective: isMobile ? 1100 : 1400 }}
          >
            <div
              className="relative h-full w-full transition-transform duration-700 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateY(${angle}deg)`,
              }}
            >
              {items.map((item, i) => {
                const rot = i * step;
                const isFront = i === activeIndex;
                if (!("img" in item)) return null;
                return (
                  <div
                    key={item.title}
                    className={`absolute left-1/2 top-1/2 overflow-hidden shadow-xl transition-all duration-500 ${
                      isMobile ? "h-[240px] w-[170px]" : "h-[300px] w-[210px] sm:h-[320px] sm:w-[225px] md:h-[340px] md:w-[240px]"
                    } ${
                      isFront
                        ? "border-2 border-[#F5821F]/70 ring-2 ring-[#F5821F]/25"
                        : "border border-white/15 opacity-80"
                    }`}
                    style={{
                      transform: `translate(-50%, -50%) rotateY(${rot}deg) translateZ(${radius}px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <Image
                      src={item.img!}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes={isMobile ? "170px" : "240px"}
                      priority={i < 3}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-[#060e1a]/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#060e1a]/95 px-3 py-3 backdrop-blur-sm sm:px-4 sm:py-4">
                      {"tag" in item && (
                        <span className="font-[family-name:var(--font-accent)] text-[9px] font-bold uppercase tracking-widest text-[#F5821F] sm:text-[10px]">
                          {item.tag}
                        </span>
                      )}
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-base font-extrabold uppercase leading-tight text-white drop-shadow-md sm:text-lg md:text-xl">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10">
          {items.map((item, i) => (
            <button
              key={item.title}
              onClick={() => goTo(i)}
              className={`border px-3 py-1.5 font-[family-name:var(--font-accent)] text-[10px] font-bold uppercase tracking-wider transition sm:text-xs ${
                activeIndex === i
                  ? "border-[#F5821F] bg-[#F5821F]/15 text-[#FFA94D]"
                  : "border-white/15 text-[#a8bdd4] hover:border-white/30 hover:text-white"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
