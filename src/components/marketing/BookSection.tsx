"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TRAINERS } from "@/lib/constants";

export function BookSection() {
  const [type, setType] = useState<"demo" | "diet">("demo");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", trainer: "", note: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, type, public: true }),
    });
    setSent(true);
  }

  return (
    <section id="book" className="relative z-10 px-7 py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-4xl md:text-5xl">Start with a free session.</h2>
        <p className="mt-3 text-[#8FA9C7]">No pressure, no payment. Pick what you need and a trainer will confirm within 24 hours.</p>

        <div className="mt-6 flex gap-2">
          {(["demo", "diet"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${type === t ? "bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] text-white" : "glass text-[#8FA9C7]"}`}
            >
              {t === "demo" ? "Free Demo Session" : "Diet Plan Appointment"}
            </button>
          ))}
        </div>

        <motion.form onSubmit={submit} className="mt-8 glass rounded-3xl p-6 space-y-3">
          {(["name", "email", "phone", "date"] as const).map((field) => (
            <input
              key={field}
              required={field !== "phone"}
              type={field === "email" ? "email" : field === "date" ? "datetime-local" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#4FA3FF]"
            />
          ))}
          <select
            value={form.trainer}
            onChange={(e) => setForm({ ...form, trainer: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
          >
            <option value="">Preferred Trainer (optional)</option>
            {TRAINERS.map((t) => (
              <option key={t.email} value={t.name}>{t.name}</option>
            ))}
          </select>
          <textarea
            placeholder="Anything we should know?"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            rows={2}
          />
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] py-3 font-bold">
            Confirm Booking
          </button>
          {sent && <p className="text-sm text-[#38BDF8]">✓ Booked! Your trainer will reach out soon.</p>}
        </motion.form>
      </div>
    </section>
  );
}
