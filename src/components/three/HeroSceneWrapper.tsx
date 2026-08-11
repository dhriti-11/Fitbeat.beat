"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useIsMobile } from "@/lib/useMediaQuery";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => null,
});

export function HeroSceneWrapper() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-[#1E6FD9]/25 blur-3xl" />
        <div className="absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-[#F5821F]/20 blur-3xl" />
      </div>
    );
  }

  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}
