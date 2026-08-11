"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SEED_REVIEWS } from "@/lib/constants";
import type { Review } from "@/lib/types";

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
    const t = setInterval(() => setActive((a) => (a + 1) % reviews.length), 4000);
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
    <section id="testimonials" className="relative z-10 px-7 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl">Reviews from the FitBeat community.</h2>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass rounded-3xl p-8 md:p-12"
        >
          <div className="text-[#FFA94D]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
          <p className="mt-4 text-lg leading-relaxed">&ldquo;{r.text}&rdquo;</p>
          <p className="mt-4 font-[family-name:var(--font-syne)] text-[#4FA3FF]">— {r.name}</p>
        </motion.div>

        <form onSubmit={submitReview} className="mt-10 glass rounded-3xl p-6">
          <h3 className="font-[family-name:var(--font-syne)] text-lg">Add Your Review</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              required
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#4FA3FF]"
            />
            <select
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </div>
          <textarea
            required
            placeholder="Your Review"
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#4FA3FF]"
            rows={3}
          />
          <button type="submit" className="mt-3 rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] px-6 py-2 text-sm font-bold">
            Post Review
          </button>
          {sent && <p className="mt-2 text-sm text-[#38BDF8]">✓ Thanks! Your review was added.</p>}
        </form>
      </div>
    </section>
  );
}
