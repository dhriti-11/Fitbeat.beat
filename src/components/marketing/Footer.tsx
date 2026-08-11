import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#040a14] px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <Logo size="lg" asLink={false} />
          <p className="mt-3 font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[0.2em] text-[#a8bdd4]">
            Kuwait · Qatar · Morbi
          </p>
        </div>
        <p className="max-w-xs text-sm font-semibold leading-relaxed text-[#a8bdd4]">
          Train with intent. Find your beat. Personalized coaching for women, teens and kids.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <a
            href="/sign-up"
            className="font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[0.16em] text-[#F5821F] hover:text-[#FFA94D]"
          >
            Sign Up Free →
          </a>
          <a
            href="/sign-in"
            className="font-[family-name:var(--font-accent)] text-xs font-bold uppercase tracking-[0.16em] text-[#a8bdd4] hover:text-white"
          >
            Member Sign In →
          </a>
        </div>
      </div>
    </footer>
  );
}
