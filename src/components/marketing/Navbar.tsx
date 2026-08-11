"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const LINKS = [
  { href: "#showcase", label: "Showcase" },
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#trainers", label: "Trainers" },
  { href: "#branches", label: "Branches" },
  { href: "#book", label: "Book" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-4 left-1/2 z-50 flex w-[min(1120px,calc(100%-2rem))] -translate-x-1/2 items-center justify-between rounded-full glass px-5 py-3">
      <Link href="/" className="font-[family-name:var(--font-syne)] text-lg font-extrabold">
        FIT<span className="grad-text">BEAT</span>
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="text-sm text-[#8FA9C7] transition hover:text-[#F3EFFF]">
            {l.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <Button
            href={session.user.role === "trainer" ? "/dashboard/trainer" : "/dashboard/client"}
            size="sm"
          >
            Dashboard
          </Button>
        ) : (
          <Button href="/sign-in" size="sm">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}
