import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#040a14] px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
        <div>
          <p className="font-[family-name:var(--font-condensed)] text-4xl uppercase tracking-wider">
            FIT<span className="text-[#F5821F]">BEAT</span>
          </p>
          <p className="mt-3 font-[family-name:var(--font-space)] text-[10px] uppercase tracking-[0.25em] text-[#8FA9C7]">
            Kuwait · Qatar · Morbi
          </p>
        </div>
        <p className="max-w-xs text-sm text-[#8FA9C7]">
          Train with intent. Find your beat. Personalized coaching for women, teens and kids.
        </p>
        <Link
          href="/sign-in"
          className="font-[family-name:var(--font-space)] text-[11px] uppercase tracking-[0.2em] text-[#F5821F] hover:text-[#FFA94D]"
        >
          Member Sign In →
        </Link>
      </div>
    </footer>
  );
}
