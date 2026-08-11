"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";

type AuthMode = "signin" | "signup";

const COPY = {
  signin: {
    title: "Sign In",
    subtitle: "Already training with us? Enter your email to access your dashboard.",
    namePlaceholder: "Your name (optional)",
    nameRequired: false,
    submitLabel: "Send Email Code",
    verifyLabel: "Verify & Sign In",
    altPrompt: "New to FitBeat?",
    altLink: { href: "/sign-up", label: "Create an account" },
  },
  signup: {
    title: "Sign Up",
    subtitle: "First time here? Create your account to book a free demo and get started.",
    namePlaceholder: "Your full name",
    nameRequired: true,
    submitLabel: "Create Account",
    verifyLabel: "Verify & Get Started",
    altPrompt: "Already have an account?",
    altLink: { href: "/sign-in", label: "Sign in" },
  },
} as const;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const copy = COPY[mode];
  const [step, setStep] = useState<"choose" | "otp">("choose");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function sendOTP() {
    if (!email) return;
    if (copy.nameRequired && !name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setLoading(true);
    setError("");
    const r = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, action: "send" }),
    });
    setLoading(false);
    if (!r.ok) {
      const data = await r.json().catch(() => ({}));
      setError(data.error || "Could not send code. Try again.");
      return;
    }
    setSent(true);
    setStep("otp");
  }

  async function verifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("otp", {
      email,
      code,
      name: name.trim() || email.split("@")[0],
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid or expired code.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="forge-frame w-full max-w-md p-8 md:p-10">
      <Logo size="sm" />
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold">{copy.title}</h1>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#a8bdd4]">{copy.subtitle}</p>

      {step === "choose" && (
        <div className="mt-8 space-y-4">
          {googleEnabled && (
            <>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="flex w-full items-center justify-center gap-3 border border-white/10 bg-white/5 py-3.5 text-sm font-bold transition hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 text-xs font-semibold text-[#a8bdd4]">
                <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#4FA3FF]"
          />
          <input
            required={copy.nameRequired}
            placeholder={copy.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#4FA3FF]"
          />
          <button
            onClick={sendOTP}
            disabled={loading || !email || (copy.nameRequired && !name.trim())}
            className="w-full bg-[#F5821F] py-3.5 text-sm font-bold text-[#060e1a] transition hover:bg-[#FFA94D] disabled:opacity-50"
          >
            {loading ? "Sending..." : copy.submitLabel}
          </button>
          {!googleEnabled && mode === "signup" && (
            <p className="text-xs font-semibold text-[#a8bdd4]">
              Dev tip: enter any email and name, then use the 6-digit code shown in your terminal if Redis/Resend isn&apos;t set up.
            </p>
          )}
        </div>
      )}

      {step === "otp" && (
        <form onSubmit={verifyOTP} className="mt-8 space-y-4">
          <p className="text-sm font-semibold text-[#a8bdd4]">
            {sent ? `Code sent to ${email}` : "Enter your code"}
          </p>
          <input
            required
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-center font-[family-name:var(--font-accent)] text-2xl font-bold tracking-[0.4em] outline-none focus:border-[#4FA3FF]"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1E6FD9] py-3.5 text-sm font-bold transition hover:bg-[#4FA3FF] disabled:opacity-50"
          >
            {loading ? "Verifying..." : copy.verifyLabel}
          </button>
          <button type="button" onClick={() => setStep("choose")} className="w-full text-sm font-semibold text-[#a8bdd4]">
            ← Back
          </button>
        </form>
      )}

      {error && <p className="mt-4 text-sm font-semibold text-red-400">{error}</p>}

      <p className="mt-8 text-center text-sm font-semibold text-[#a8bdd4]">
        {copy.altPrompt}{" "}
        <Link href={copy.altLink.href} className="text-[#F5821F] hover:text-[#FFA94D]">
          {copy.altLink.label}
        </Link>
      </p>
    </div>
  );
}
