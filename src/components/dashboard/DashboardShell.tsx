"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative z-10 flex min-h-[100svh] flex-col lg:flex-row">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0F2540]/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo size="sm" />
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold uppercase tracking-widest"
        >
          Menu
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100vw,280px)] flex-col border-r border-white/10 bg-[#0F2540] p-5 transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 lg:bg-[#0F2540]/80 lg:backdrop-blur-xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-6 flex items-center justify-between lg:block">
          <Logo size="sm" className="hidden sm:block lg:hidden" />
          <Logo size="sm" className="sm:hidden" />
          <Logo size="sm" className="hidden lg:block" />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="text-sm text-[#a8bdd4] lg:hidden"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNav(item.id);
                setSidebarOpen(false);
              }}
              className={clsx(
                "rounded-xl px-4 py-3 text-left text-sm font-semibold transition",
                active === item.id
                  ? "bg-gradient-to-r from-[#1E6FD9]/30 to-[#F5821F]/20 text-white"
                  : "text-[#a8bdd4] hover:bg-white/5"
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#a8bdd4] hover:bg-white/5"
        >
          Log Out
        </button>
      </aside>

      <div className="flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10">
        <div className="mb-6 md:mb-8">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-extrabold sm:text-2xl md:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 break-all text-xs font-semibold text-[#a8bdd4] sm:text-sm">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
