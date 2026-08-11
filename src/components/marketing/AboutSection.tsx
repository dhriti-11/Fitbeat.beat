"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MEDIA } from "@/lib/media";

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 px-7 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="font-[family-name:var(--font-space)] text-xs uppercase tracking-widest text-[#4FA3FF]">The Studio</p>
          <h2 className="mt-3 text-4xl md:text-5xl">Fitness that fits how you actually live.</h2>
          <p className="mt-5 leading-relaxed text-[#8FA9C7]">
            FitBeat is your personal movement revolution — where you work with a real coach who knows your name, your joints, and your goals. Every class is live, every milestone celebrated together.
          </p>
          <p className="mt-4 leading-relaxed text-[#8FA9C7]">
            Designed for women, teen girls, and kids — empowering, fun, and never one-size-fits-all.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid gap-4"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass">
            <Image
              src={MEDIA.transformations[0].image}
              alt="Transformation"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A1930] p-4">
              <p className="font-[family-name:var(--font-syne)] text-sm">{MEDIA.transformations[0].name}&apos;s Transformation</p>
            </div>
          </div>
          <video src={MEDIA.aboutClip} controls className="rounded-2xl glass" />
        </motion.div>
      </div>
    </section>
  );
}
