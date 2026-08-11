"use client";

import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function MessageThread({
  clientEmail,
  currentUserEmail,
  isTrainer,
}: {
  clientEmail: string;
  currentUserEmail: string;
  isTrainer: boolean;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function load() {
    const q = isTrainer ? `?clientEmail=${encodeURIComponent(clientEmail)}` : "";
    const r = await fetch(`/api/messages${q}`);
    const d = await r.json();
    setMessages(d.messages || []);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, [clientEmail, isTrainer]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, clientEmail: isTrainer ? clientEmail : undefined }),
    });
    setText("");
    load();
  }

  return (
    <div className="glass flex h-96 flex-col rounded-2xl">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-[#8FA9C7]">No messages yet. Start the conversation!</p>
        )}
        {messages.map((m) => {
          const mine = m.from.toLowerCase() === currentUserEmail.toLowerCase();
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${mine ? "bg-[#1E6FD9]/40" : "bg-white/10"}`}>
                <p>{m.text}</p>
                <p className="mt-1 text-[10px] text-[#8FA9C7]">{formatDate(m.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-white/10 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none"
        />
        <button type="submit" className="rounded-xl bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] px-4 py-2 text-sm font-bold">
          Send
        </button>
      </form>
    </div>
  );
}
