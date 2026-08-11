"use client";

import { useState } from "react";
import { TRAINERS } from "@/lib/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";

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
    <section id="book" className="relative z-10 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:px-10 lg:grid-cols-2">
        <div>
          <SectionLabel>Join FitBeat</SectionLabel>
          <h2 className="section-heading">
            Start With A
            <br />
            <span className="text-[#F5821F]">Free Session.</span>
          </h2>
          <p className="mt-6 max-w-md text-[#8FA9C7]">
            No pressure, no payment. A trainer confirms your slot within 24 hours and sends your Zoom link directly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(["demo", "diet"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 font-[family-name:var(--font-space)] text-[10px] uppercase tracking-widest transition ${
                  type === t
                    ? "bg-[#F5821F] text-[#060e1a]"
                    : "forge-frame text-[#8FA9C7] hover:border-[#F5821F]/40"
                }`}
              >
                {t === "demo" ? "Free Demo" : "Diet Consult"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={submit} className="forge-frame space-y-4 p-8 md:p-10">
          {(["name", "email", "phone", "date"] as const).map((field) => (
            <input
              key={field}
              required={field !== "phone"}
              type={field === "email" ? "email" : field === "date" ? "datetime-local" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none transition focus:border-[#F5821F]"
            />
          ))}
          <select
            value={form.trainer}
            onChange={(e) => setForm({ ...form, trainer: e.target.value })}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm"
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
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm"
            rows={3}
          />
          <button
            type="submit"
            className="w-full bg-[#F5821F] py-4 font-[family-name:var(--font-space)] text-xs font-bold uppercase tracking-[0.2em] text-[#060e1a] transition hover:bg-[#FFA94D]"
          >
            Confirm Booking
          </button>
          {sent && <p className="text-sm text-[#4FA3FF]">✓ Booked! Your trainer will reach out soon.</p>}
        </form>
      </div>
    </section>
  );
}
