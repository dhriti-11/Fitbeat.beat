"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { clsx } from "@/lib/utils";

const LINKS = [
  { href: "#showcase", label: "Showcase" },
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#trainers", label: "Trainers" },
  { href: "#book", label: "Join" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "border-b border-white/10 bg-[#060e1a]/90 py-3 backdrop-blur-xl" : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10">
        <Link href="/" className="font-[family-name:var(--font-condensed)] text-2xl uppercase tracking-wider md:text-3xl">
          FIT<span className="text-[#F5821F]">BEAT</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-[family-name:var(--font-space)] text-[11px] font-medium uppercase tracking-[0.2em] text-[#8FA9C7] transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <Button
              href={session.user.role === "trainer" ? "/dashboard/trainer" : "/dashboard/client"}
              size="sm"
              variant="gold"
            >
              Dashboard
            </Button>
          ) : (
            <Button href="/sign-in" size="sm" variant="gold">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
