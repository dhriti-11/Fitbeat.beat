"use client";

import { useState } from "react";

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
    <section id="contact" className="relative z-10 px-7 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div>
          <h2 className="text-4xl md:text-5xl">Talk to a trainer directly.</h2>
          <p className="mt-3 text-[#8FA9C7]">Questions about a plan, an injury, or which coach fits your goal?</p>
          <div className="mt-8 space-y-3 text-[#8FA9C7]">
            <p>hello@fitbeat.studio</p>
            <p>+91 98765 43210</p>
          </div>
        </div>
        <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-3">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
          />
          <textarea
            required
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
            rows={4}
          />
          <button type="submit" className="w-full rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] py-3 font-bold">
            Send Message
          </button>
          {sent && <p className="text-sm text-[#38BDF8]">✓ Message sent — a trainer typically replies within a day.</p>}
        </form>
      </div>
    </section>
  );
}
