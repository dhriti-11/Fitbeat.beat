"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useIsMobile } from "@/lib/useMediaQuery";

const LogoIntroScene = dynamic(() => import("./LogoIntroScene").then((m) => m.LogoIntroScene), {
  ssr: false,
});

type IntroSplashProps = {
  onComplete: () => void;
};

const DURATION_MS = 3200;
const LETTERS = [
  { char: "F", color: "#4FA3FF", delay: 0.55 },
  { char: "I", color: "#4FA3FF", delay: 0.62 },
  { char: "T", color: "#4FA3FF", delay: 0.69 },
  { char: "B", color: "#F5821F", delay: 0.78 },
  { char: "E", color: "#F5821F", delay: 0.85 },
  { char: "A", color: "#F5821F", delay: 0.92 },
  { char: "T", color: "#F5821F", delay: 0.99 },
];

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const isMobile = useIsMobile();
  const [exiting, setExiting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const duration = reducedMotion ? 1200 : DURATION_MS;
    const exitTimer = setTimeout(() => setExiting(true), duration - 600);
    const doneTimer = setTimeout(onComplete, duration);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, reducedMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#060e1a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-[#1E6FD9]/25 blur-[120px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-[#F5821F]/20 blur-[120px]"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>

      <motion.div
        className="relative flex w-full max-w-lg flex-col items-center px-6"
        initial={{ opacity: 0 }}
        animate={{
          opacity: exiting ? 0 : 1,
          scale: exiting ? 1.05 : 1,
          y: exiting ? -16 : 0,
        }}
        transition={{ duration: exiting ? 0.55 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative h-[min(54vw,300px)] w-[min(82vw,380px)]"
          initial={{ opacity: 0, scale: 0.3, rotateY: -90, rotateZ: -8 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0, rotateZ: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#4FA3FF]/20 to-[#F5821F]/20 blur-2xl"
            animate={{ scale: [0.9, 1.08, 0.9], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {!isMobile && !reducedMotion ? (
            <Suspense fallback={null}>
              <LogoIntroScene />
            </Suspense>
          ) : (
            <motion.div
              className="relative h-full w-full"
              animate={
                reducedMotion
                  ? {}
                  : {
                      rotateY: [0, 12, -12, 0],
                      scale: [0.95, 1.06, 1],
                    }
              }
              transition={{ duration: 2.4, ease: "easeInOut" }}
            >
              <Image
                src="/brand/fitbeat-logo.png"
                alt="FitBeat"
                fill
                className="object-contain drop-shadow-[0_0_60px_rgba(79,163,255,0.45)]"
                priority
              />
            </motion.div>
          )}
        </motion.div>

        <div className="mt-5 flex items-center justify-center">
          {LETTERS.map(({ char, color, delay }, i) => (
            <motion.span
              key={`${char}-${i}`}
              className="font-[family-name:var(--font-display)] text-5xl font-black uppercase tracking-tight md:text-7xl"
              style={{
                color,
                textShadow: `0 0 30px ${color}66, 0 4px 0 rgba(0,0,0,0.3)`,
              }}
              initial={{ opacity: 0, y: 40, scale: 0.5, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 12,
                delay: reducedMotion ? 0.2 : delay,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>

        <motion.div
          className="mt-5 flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          <motion.span
            className="h-px w-12 bg-gradient-to-r from-transparent to-[#F5821F]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.15, duration: 0.6 }}
          />
          <p className="font-[family-name:var(--font-accent)] text-[11px] font-bold uppercase tracking-[0.32em] text-[#a8bdd4]">
            Your Fitness Companion
          </p>
          <motion.span
            className="h-px w-12 bg-gradient-to-l from-transparent to-[#4FA3FF]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.15, duration: 0.6 }}
          />
        </motion.div>

        <motion.div
          className="mt-8 h-1 w-40 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#4FA3FF] via-[#F5821F] to-[#4FA3FF] bg-[length:200%_100%]"
            initial={{ width: "0%" }}
            animate={{ width: "100%", backgroundPosition: ["0% 0%", "100% 0%"] }}
            transition={{
              width: { duration: reducedMotion ? 0.8 : 2.2, ease: "easeInOut" },
              backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" },
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
