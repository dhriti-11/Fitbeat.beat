"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
  }

  return (
    <section id="contact" className="relative z-10 border-t border-white/10 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 md:px-10 lg:grid-cols-2">
        <div>
          <SectionLabel>Get In Touch</SectionLabel>
          <h2 className="section-heading">
            Talk To A
            <br />
            <span className="text-[#4FA3FF]">Trainer.</span>
          </h2>
          <p className="mt-6 max-w-md text-[#8FA9C7]">
            Questions about a plan, an injury, or which coach fits your goal? Send it straight to the team.
          </p>
          <div className="mt-10 space-y-2 font-[family-name:var(--font-accent)] text-sm uppercase tracking-widest text-[#8FA9C7]">
            <p>hello@fitbeat.studio</p>
            <p>+91 98765 43210</p>
          </div>
        </div>

        <form onSubmit={submit} className="forge-frame space-y-4 p-8 md:p-10">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none focus:border-[#4FA3FF]"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm outline-none focus:border-[#4FA3FF]"
          />
          <textarea
            required
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm"
            rows={5}
          />
          <button
            type="submit"
            className="w-full border border-[#4FA3FF]/40 py-4 font-[family-name:var(--font-accent)] text-xs uppercase tracking-[0.2em] transition hover:bg-[#4FA3FF]/10"
          >
            Send Message
          </button>
          {sent && <p className="text-sm text-[#4FA3FF]">✓ Message sent — a trainer typically replies within a day.</p>}
        </form>
      </div>
    </section>
  );
}
