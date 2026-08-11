"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-48 w-48 rounded-full bg-gradient-to-br from-[#1E6FD9]/30 to-[#F5821F]/30 blur-2xl animate-pulse" />
    </div>
  ),
});

export function HeroSceneWrapper() {
  return (
    <Suspense fallback={null}>
      <HeroScene />
    </Suspense>
  );
}
