"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MEDIA } from "@/lib/media";

export function ShowcaseSection() {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  return (
    <section id="showcase" className="relative z-10 px-7 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl">Watch FitBeat In Motion</h2>
          <p className="mt-3 max-w-xl text-[#8FA9C7]">Real sessions, real trainers, real energy — press play and see the studio in action.</p>
        </motion.div>
        <div className="relative mt-10 overflow-hidden rounded-3xl glass">
          <video
            src={MEDIA.heroVideo}
            autoPlay
            loop
            muted={muted}
            playsInline
            className="aspect-video w-full object-cover"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            id="showcaseVideo"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="rounded-full glass px-4 py-2 text-sm"
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <button
              onClick={() => {
                const v = document.getElementById("showcaseVideo") as HTMLVideoElement;
                if (v?.paused) v.play();
                else v?.pause();
              }}
              className="rounded-full glass px-4 py-2 text-sm"
            >
              {playing ? "⏸" : "▶"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
