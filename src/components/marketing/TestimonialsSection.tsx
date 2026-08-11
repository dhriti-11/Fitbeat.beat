"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SEED_REVIEWS } from "@/lib/constants";
import type { Review } from "@/lib/types";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [active, setActive] = useState(0);
  const [form, setForm] = useState({ name: "", text: "", rating: 5 });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => {
        if (d.reviews?.length) setReviews(d.reviews);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const updated = [...reviews, form];
    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => {});
    setReviews(updated);
    setSent(true);
    setForm({ name: "", text: "", rating: 5 });
  }

  const r = reviews[active];

  return (
    <section id="testimonials" className="relative z-10 border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionLabel>Community</SectionLabel>
        <h2 className="section-heading max-w-2xl">
          Real Members.
          <span className="text-[#F5821F]"> Real Words.</span>
        </h2>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="forge-frame relative min-h-[280px] p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-2xl text-[#F5821F]">{"★".repeat(r.rating)}</div>
                <p className="mt-6 text-xl leading-relaxed md:text-2xl">&ldquo;{r.text}&rdquo;</p>
                <p className="mt-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-wide text-[#4FA3FF]">
                  — {r.name}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-6 right-6 flex gap-2 md:bottom-10 md:right-10">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 transition-all ${i === active ? "w-8 bg-[#F5821F]" : "w-1.5 bg-white/20"}`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={submitReview} className="forge-frame p-8">
            <h3 className="font-[family-name:var(--font-display)] text-2xl uppercase">Add Your Review</h3>
            <div className="mt-6 space-y-3">
              <input
                required
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none focus:border-[#F5821F]"
              />
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
              <textarea
                required
                placeholder="Your Review"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm"
                rows={4}
              />
              <button
                type="submit"
                className="w-full bg-[#1E6FD9] py-3 font-[family-name:var(--font-accent)] text-[10px] uppercase tracking-widest"
              >
                Post Review
              </button>
              {sent && <p className="text-sm text-[#4FA3FF]">✓ Thanks! Your review was added.</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
