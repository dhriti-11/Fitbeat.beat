"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { clsx } from "@/lib/utils";

const LINKS = [
  { href: "#showcase", label: "Showcase" },
  { href: "#about", label: "About" },
  { href: "#programs", label: "Programs" },
  { href: "#trainers", label: "Trainers" },
  { href: "#book", label: "Join" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || menuOpen
            ? "border-b border-white/10 bg-[#060e1a]/95 py-3 backdrop-blur-xl"
            : "bg-transparent py-4 md:py-5"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:px-10">
          <Logo size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:block" />

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[0.14em] text-[#a8bdd4] transition hover:text-[#4FA3FF]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <Button
                href={session.user.role === "trainer" ? "/dashboard/trainer" : "/dashboard/client"}
                size="sm"
                variant="gold"
                className="hidden sm:inline-flex"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button href="/sign-in" size="sm" variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
                <Button href="/sign-up" size="sm" variant="gold" className="hidden sm:inline-flex">
                  Sign Up
                </Button>
              </>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/5 lg:hidden"
            >
              <span className="sr-only">Menu</span>
              <div className="flex w-5 flex-col gap-1.5">
                <span
                  className={clsx(
                    "block h-0.5 w-full bg-white transition",
                    menuOpen && "translate-y-2 rotate-45"
                  )}
                />
                <span className={clsx("block h-0.5 w-full bg-white transition", menuOpen && "opacity-0")} />
                <span
                  className={clsx(
                    "block h-0.5 w-full bg-white transition",
                    menuOpen && "-translate-y-2 -rotate-45"
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMenu}
        aria-hidden
      />
      <nav
        className={clsx(
          "fixed top-0 right-0 z-50 flex h-full w-[min(100vw,320px)] flex-col border-l border-white/10 bg-[#060e1a] p-6 pt-20 transition-transform duration-300 lg:hidden",
          menuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 font-[family-name:var(--font-accent)] text-sm font-bold uppercase tracking-widest text-[#a8bdd4] transition hover:bg-white/5 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="mt-auto space-y-3 border-t border-white/10 pt-6">
          {session ? (
            <Button
              href={session.user.role === "trainer" ? "/dashboard/trainer" : "/dashboard/client"}
              variant="gold"
              className="w-full"
              onClick={closeMenu}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button href="/sign-up" variant="gold" className="w-full" onClick={closeMenu}>
                Sign Up
              </Button>
              <Button href="/sign-in" variant="ghost" className="w-full" onClick={closeMenu}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
