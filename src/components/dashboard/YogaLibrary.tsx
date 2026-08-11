"use client";

import { useState } from "react";
import { YOGA_POSES } from "@/lib/constants";

export function YogaLibrary() {
  const [search, setSearch] = useState("");
  const filtered = YOGA_POSES.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sk.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search a pose (e.g. warrior, cobra, tree)..."
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-[#4FA3FF]"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.name} className="glass rounded-2xl p-5">
            <h3 className="font-[family-name:var(--font-display)] font-bold">{p.name}</h3>
            <p className="text-xs text-[#4FA3FF]">{p.sk}</p>
            <p className="mt-2 text-sm text-[#8FA9C7]">{p.benefits}</p>
            <p className="mt-2 text-xs text-[#8FA9C7]/80">{p.how}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
