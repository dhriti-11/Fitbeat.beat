"use client";

import { useEffect, useState } from "react";
import type { Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function TaskList({
  clientEmail,
  isTrainer,
}: {
  clientEmail: string;
  isTrainer: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  async function load() {
    const q = `?clientEmail=${encodeURIComponent(clientEmail)}`;
    const r = await fetch(`/api/tasks${q}`);
    const d = await r.json();
    setTasks(d.tasks || []);
  }

  useEffect(() => { load(); }, [clientEmail]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate, clientEmail }),
    });
    setTitle("");
    setDueDate("");
    load();
  }

  async function toggle(id: string) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle", taskId: id, clientEmail }),
    });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", taskId: id, clientEmail }),
    });
    load();
  }

  return (
    <div className="space-y-4">
      {isTrainer && (
        <form onSubmit={addTask} className="glass flex flex-wrap gap-2 rounded-2xl p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none min-w-[200px]"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-[#1E6FD9] px-4 py-2 text-sm font-bold">Assign Task</button>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center text-[#8FA9C7]">No tasks assigned yet.</div>
      ) : (
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="glass flex items-center gap-3 rounded-xl p-4">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t.id)}
                className="h-4 w-4 accent-[#F5821F]"
              />
              <div className="flex-1">
                <p className={t.completed ? "line-through text-[#8FA9C7]" : ""}>{t.title}</p>
                <p className="text-xs text-[#8FA9C7]">Due: {formatDate(t.dueDate)}</p>
              </div>
              {isTrainer && (
                <button onClick={() => remove(t.id)} className="text-xs text-red-400">Delete</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
