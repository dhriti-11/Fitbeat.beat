"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { storageGet } from "@/lib/storage-client";
import type { Appointment } from "@/lib/types";

export default function ClientGatePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [hasBooking, setHasBooking] = useState(false);
  const [checking, setChecking] = useState(false);

  const email = session?.user?.email?.toLowerCase() || "";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-in");
    if (status === "authenticated") {
      if (session.user.role === "trainer") router.push("/dashboard/trainer");
      if (session.user.dashboardAccess) router.push("/dashboard/client");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!email) return;
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => {
        const mine = (d.appointments || []).filter(
          (a: Appointment) => a.email.toLowerCase() === email
        );
        setHasBooking(mine.length > 0);
      });
  }, [email]);

  async function checkAgain() {
    setChecking(true);
    await update();
    const users = await storageGet<Record<string, { dashboardAccess: boolean }>>("users");
    if (users?.[email]?.dashboardAccess) {
      router.push("/dashboard/client");
    }
    setChecking(false);
  }

  if (status === "loading" || !session) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const name = session.user.name?.split(" ")[0] || "there";

  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-lg rounded-3xl p-8 text-center">
        <div className="text-4xl">{hasBooking ? "✓" : "👋"}</div>
        <h1 className="mt-4 text-2xl font-bold">
          {hasBooking ? `You're registered, ${name}!` : `Welcome, ${name}!`}
        </h1>
        <p className="mt-3 text-[#8FA9C7]">
          {hasBooking
            ? "Our team will contact you soon to confirm your free demo. Once your trainer approves you, your full dashboard — diet plans, classes, progress tracking and more — unlocks right here."
            : "Register for a free demo to get started. Your trainer will reach out and unlock your personalized dashboard after your session."}
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
          {["🥗 Diet Plans", "📅 Class Calendar", "📈 Progress", "🧘 Yoga Library", "📣 Updates", "💬 Direct Chat"].map((f) => (
            <div key={f} className="rounded-xl bg-white/5 px-3 py-2 text-[#8FA9C7]">{f}</div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {!hasBooking && (
            <Link
              href="/sign-up"
              className="rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] py-3 font-bold"
            >
              Register for Free Demo
            </Link>
          )}
          <button
            onClick={checkAgain}
            disabled={checking}
            className="rounded-full border border-white/10 py-3 text-sm text-[#4FA3FF]"
          >
            {checking ? "Checking..." : "Check Again"}
          </button>
          <Link href="/" className="text-sm text-[#8FA9C7] hover:text-white">
            ← Back to homepage
          </Link>
        </div>

        <p className="mt-6 font-[family-name:var(--font-accent)] text-xs uppercase tracking-widest text-[#8FA9C7]">
          Your trainer grants dashboard access after your demo
        </p>
      </div>
    </main>
  );
}
