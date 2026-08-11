"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { clsx } from "@/lib/utils";

type NavItem = { id: string; label: string; icon?: string };

export function DashboardShell({
  title,
  subtitle,
  nav,
  active,
  onNav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  active: string;
  onNav: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen">
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-white/10 bg-[#0F2540]/80 p-5 backdrop-blur-xl lg:flex">
        <Link href="/" className="font-[family-name:var(--font-syne)] text-lg font-extrabold">
          FIT<span className="grad-text">BEAT</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={clsx(
                "rounded-xl px-4 py-2.5 text-left text-sm transition",
                active === item.id ? "bg-gradient-to-r from-[#1E6FD9]/30 to-[#F5821F]/20 text-white" : "text-[#8FA9C7] hover:bg-white/5"
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-auto rounded-xl px-4 py-2 text-left text-sm text-[#8FA9C7] hover:bg-white/5"
        >
          Log Out
        </button>
      </aside>

      <div className="flex-1 overflow-auto p-6 md:p-10">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-[#8FA9C7]">{subtitle}</p>}
          </div>
          <select
            value={active}
            onChange={(e) => onNav(e.target.value)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm lg:hidden"
          >
            {nav.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
        {children}
      </div>
    </div>
  );
}
