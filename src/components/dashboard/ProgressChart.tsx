"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { ProgressPoint } from "@/lib/types";

export function ProgressChart({ data }: { data: ProgressPoint[] }) {
  if (!data.length) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-[#8FA9C7]">
        No progress logged yet. Ask your trainer to log your first check-in.
      </div>
    );
  }

  const chartData = data.map((p) => ({
    name: p.label,
    value: p.value,
    date: new Date(p.date).toLocaleDateString(),
  }));

  return (
    <div className="glass h-64 rounded-2xl p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="date" stroke="#8FA9C7" fontSize={12} />
          <YAxis stroke="#8FA9C7" fontSize={12} />
          <Tooltip contentStyle={{ background: "#0F2540", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
          <Line type="monotone" dataKey="value" stroke="#4FA3FF" strokeWidth={2} dot={{ fill: "#F5821F" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
