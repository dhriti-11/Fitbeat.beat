"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ClientWelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-up");
    if (status === "authenticated") {
      if (session.user.role === "trainer") router.push("/dashboard/trainer");
      if (session.user.dashboardAccess) router.push("/dashboard/client");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const name = session.user.name?.split(" ")[0] || "there";

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center md:p-10">
        <div className="text-5xl">✓</div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold">
          You&apos;re registered, {name}!
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#a8bdd4]">
          Thank you for signing up with FitBeat. Our team will contact you soon to confirm your free
          demo session and match you with the right trainer.
        </p>
        <div className="mt-8 rounded-xl border border-[#F5821F]/30 bg-[#F5821F]/10 px-5 py-4 text-sm text-[#FFA94D]">
          A trainer typically reaches out within 24 hours. Once your demo is done, your personalized
          dashboard will unlock here.
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/dashboard/client/gate"
            className="rounded-full border border-white/15 py-3 text-sm font-bold text-[#4FA3FF] transition hover:bg-white/5"
          >
            View registration status
          </Link>
          <Link href="/" className="text-sm text-[#8FA9C7] hover:text-white">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
