"use client";

import { useEffect, useState } from "react";
import type { ClassEvent, LeaveRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const KIND_LABELS: Record<string, string> = {
  diet: "🥗 Diet",
  workout: "💪 Workout",
  reminder: "⏰ Reminder",
  personal: "✉️ Personal",
  chat: "💬 Chat",
};

export function LeaveRequestPanel({
  classes,
  isTrainer,
  clientEmail,
}: {
  classes: ClassEvent[];
  isTrainer: boolean;
  clientEmail?: string;
}) {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/leave-requests");
    const d = await r.json();
    let list: LeaveRequest[] = d.requests || [];
    if (isTrainer && clientEmail) {
      list = list.filter((req) => req.clientEmail.toLowerCase() === clientEmail.toLowerCase());
    }
    setRequests(list);
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [isTrainer, clientEmail]);

  async function submitLeave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClass || !reason.trim()) return;
    const cls = classes.find((c) => c.id === selectedClass);
    if (!cls) return;
    setLoading(true);
    const r = await fetch("/api/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId: cls.id,
        className: cls.name,
        classDatetime: cls.datetime,
        reason,
      }),
    });
    setLoading(false);
    if (r.ok) {
      setReason("");
      setSelectedClass("");
      load();
    }
  }

  async function review(id: string, status: "approved" | "denied") {
    await fetch("/api/leave-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "review", id, status }),
    });
    load();
  }

  const upcoming = classes
    .filter((c) => new Date(c.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-bold">{isTrainer ? "Leave Requests" : "Request Leave for Live Session"}</h3>
      <p className="mt-1 text-sm text-[#8FA9C7]">
        {isTrainer
          ? "Review and approve or deny client leave requests for live sessions."
          : "Can't attend a live session? Send a leave request to your trainer."}
      </p>

      {!isTrainer && (
        <form onSubmit={submitLeave} className="mt-4 space-y-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none"
          >
            <option value="">Select a live session...</option>
            {upcoming.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {formatDate(c.datetime)}
              </option>
            ))}
          </select>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            required
            placeholder="Why do you need leave for this session?"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || upcoming.length === 0}
            className="rounded-full bg-[#F5821F] px-5 py-2 text-sm font-bold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Leave Request"}
          </button>
          {upcoming.length === 0 && (
            <p className="text-xs text-[#8FA9C7]">No upcoming live sessions to request leave for.</p>
          )}
        </form>
      )}

      <div className="mt-4 space-y-2">
        {requests.length === 0 ? (
          <p className="text-sm text-[#8FA9C7]">No leave requests yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="rounded-xl bg-white/5 p-4 text-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {isTrainer && <p className="font-bold text-[#4FA3FF]">{req.clientName}</p>}
                  <p className="font-semibold">{req.className}</p>
                  <p className="text-[#8FA9C7]">{formatDate(req.classDatetime)}</p>
                  <p className="mt-1">{req.reason}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    req.status === "pending"
                      ? "bg-[#FFA94D]/20 text-[#FFA94D]"
                      : req.status === "approved"
                        ? "bg-[#38BDF8]/20 text-[#38BDF8]"
                        : "bg-red-400/20 text-red-400"
                  }`}
                >
                  {req.status}
                </span>
              </div>
              {isTrainer && req.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => review(req.id, "approved")}
                    className="rounded-full bg-[#38BDF8]/20 px-4 py-1.5 text-xs font-bold text-[#38BDF8]"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => review(req.id, "denied")}
                    className="rounded-full bg-red-400/20 px-4 py-1.5 text-xs font-bold text-red-400"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isTrainer && pending.length > 0 && !clientEmail && (
        <p className="mt-3 text-xs text-[#FFA94D]">{pending.length} pending request(s) across all clients</p>
      )}
    </div>
  );
}

export function MessageKindBadge({ kind, subject }: { kind?: string; subject?: string }) {
  if (!kind || kind === "chat") return null;
  return (
    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#F5821F]">
      {KIND_LABELS[kind] || kind}{subject ? ` · ${subject}` : ""}
    </span>
  );
}
