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

const DURATION_MS = 2800;

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
    const exitTimer = setTimeout(() => setExiting(true), duration - 500);
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
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#1E6FD9]/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-64 w-64 rounded-full bg-[#F5821F]/15 blur-[100px]" />
      </div>

      <motion.div
        className="relative flex w-full max-w-md flex-col items-center px-6"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{
          opacity: exiting ? 0 : 1,
          scale: exiting ? 0.94 : 1,
          y: exiting ? -8 : 0,
        }}
        transition={{ duration: exiting ? 0.5 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative h-[min(52vw,280px)] w-[min(80vw,360px)]">
          {!isMobile && !reducedMotion ? (
            <Suspense fallback={null}>
              <LogoIntroScene />
            </Suspense>
          ) : (
            <motion.div
              className="relative h-full w-full"
              animate={reducedMotion ? {} : { rotateY: [0, 8, -8, 0], scale: [1, 1.03, 1] }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            >
              <Image
                src="/brand/fitbeat-logo.png"
                alt="FitBeat"
                fill
                className="object-contain drop-shadow-[0_0_40px_rgba(79,163,255,0.25)]"
                priority
              />
            </motion.div>
          )}
        </div>

        <motion.h1
          className="mt-4 font-[family-name:var(--font-display)] text-4xl font-extrabold uppercase tracking-wider md:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="text-[#4FA3FF]"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
          >
            FIT
          </motion.span>
          <motion.span
            className="text-[#F5821F]"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
          >
            BEAT
          </motion.span>
        </motion.h1>

        <motion.div
          className="mt-4 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#F5821F]" />
          <p className="font-[family-name:var(--font-accent)] text-[10px] font-bold uppercase tracking-[0.28em] text-[#a8bdd4]">
            Your Fitness Companion
          </p>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#4FA3FF]" />
        </motion.div>

        <motion.div
          className="mt-8 h-0.5 w-32 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[#4FA3FF] to-[#F5821F]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: reducedMotion ? 0.8 : 2, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
