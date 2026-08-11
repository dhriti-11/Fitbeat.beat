"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MEDIA } from "@/lib/media";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AboutSection() {
  return (
    <section id="about" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel>The FitBeat Philosophy</SectionLabel>
          <h2 className="section-heading">
            Fitness That
            <br />
            <span className="text-[#4FA3FF]">Fits Your Life.</span>
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[#8FA9C7] md:text-lg">
            Not another generic gym page. FitBeat is personal coaching reimagined — live classes, evolving diet plans, and progress you can actually see. Built for women, teen girls, and kids who want to move with confidence.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-10">
            {[
              { n: "3", l: "Global Branches" },
              { n: "100%", l: "Trainer-Led" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-[family-name:var(--font-condensed)] text-6xl leading-none text-[#F5821F]">{s.n}</div>
                <div className="mt-2 font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.2em] text-[#8FA9C7]">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="forge-frame relative aspect-[4/5] overflow-hidden">
            <Image src={MEDIA.transformations[0].image} alt="Transformation" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060e1a] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.25em] text-[#F5821F]">
                Transformation Story
              </p>
              <p className="mt-2 font-[family-name:var(--font-condensed)] text-3xl uppercase">
                {MEDIA.transformations[0].name}&apos;s Journey
              </p>
            </div>
          </div>
          <div className="mt-4 forge-frame overflow-hidden">
            <video src={MEDIA.aboutClip} controls className="aspect-video w-full object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
