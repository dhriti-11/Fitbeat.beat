import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-7 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="font-[family-name:var(--font-syne)] text-xl font-extrabold">
          FIT<span className="grad-text">BEAT</span>
        </div>
        <p className="text-sm text-[#8FA9C7]">Kuwait · Qatar · Morbi — Train to the Rhythm</p>
        <Link href="/sign-in" className="text-sm text-[#4FA3FF] hover:underline">
          Member Sign In
        </Link>
      </div>
    </footer>
  );
}
