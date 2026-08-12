"use client";

import { useState } from "react";
import type { MessageKind } from "@/lib/types";

const SEND_TYPES: { kind: MessageKind; label: string; icon: string; placeholder: string }[] = [
  { kind: "personal", label: "Personal Note", icon: "✉️", placeholder: "Write a personal message to your client..." },
  { kind: "diet", label: "Diet Tip", icon: "🥗", placeholder: "Share a diet tip, meal swap, or nutrition note..." },
  { kind: "workout", label: "Workout Plan", icon: "💪", placeholder: "Send a workout adjustment or exercise note..." },
  { kind: "reminder", label: "Reminder", icon: "⏰", placeholder: "Send a reminder about class, hydration, rest..." },
];

export function PersonalSend({ clientEmail }: { clientEmail: string }) {
  const [kind, setKind] = useState<MessageKind>("personal");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const active = SEND_TYPES.find((t) => t.kind === kind)!;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setSent(false);
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, clientEmail, kind, subject: subject || active.label }),
    });
    setText("");
    setSubject("");
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold">Send to Client Personally</h3>
      <p className="mt-1 text-sm text-[#8FA9C7]">Deliver diet tips, workout notes, or personal messages directly.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {SEND_TYPES.map((t) => (
          <button
            key={t.kind}
            type="button"
            onClick={() => setKind(t.kind)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              kind === t.kind
                ? "bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] text-white"
                : "bg-white/5 text-[#8FA9C7] hover:bg-white/10"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={send} className="mt-4 space-y-3">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={`Subject (optional — defaults to "${active.label}")`}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-[#4FA3FF]"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          required
          placeholder={active.placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#4FA3FF]"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] px-6 py-2.5 text-sm font-bold disabled:opacity-50"
          >
            {sending ? "Sending..." : `Send ${active.label}`}
          </button>
          {sent && <span className="text-sm text-[#38BDF8]">✓ Sent to client</span>}
        </div>
      </form>
    </div>
  );
}
