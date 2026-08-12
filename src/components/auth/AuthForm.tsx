"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH === "true";

type AuthMode = "signin" | "signup";

const inputClass =
  "w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-semibold outline-none focus:border-[#4FA3FF]";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isSignUp = mode === "signup";
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      setError("Please enter your email and name.");
      return;
    }
    if (isSignUp && (!age || !country.trim() || !state.trim() || !city.trim())) {
      setError("Please fill in age, country, state, and city.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signIn("email", {
      email: email.trim(),
      name: name.trim(),
      age: isSignUp ? age : "",
      country: isSignUp ? country.trim() : "",
      state: isSignUp ? state.trim() : "",
      city: isSignUp ? city.trim() : "",
      phone: isSignUp ? phone.trim() : "",
      isSignUp: isSignUp ? "true" : "false",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Could not continue. Check your details and try again.");
      return;
    }

    router.push(isSignUp ? "/dashboard/client/welcome" : "/dashboard");
    router.refresh();
  }

  return (
    <div className="forge-frame w-full max-w-md p-8 md:p-10">
      <Logo size="sm" />
      <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-extrabold">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h1>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-[#a8bdd4]">
        {isSignUp
          ? "Tell us about yourself to register for a free demo."
          : "Welcome back — enter your email and name to continue."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {googleEnabled && (
          <>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex w-full items-center justify-center gap-3 border border-white/10 bg-white/5 py-3.5 text-sm font-bold transition hover:bg-white/10"
            >
              Continue with Google
            </button>
            <div className="flex items-center gap-3 text-xs font-semibold text-[#a8bdd4]">
              <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
            </div>
          </>
        )}

        <input
          type="text"
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        {isSignUp && (
          <>
            <input
              type="number"
              required
              min={10}
              max={100}
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              required
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              required
              placeholder="State / Province"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              required
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
            <input
              type="tel"
              placeholder="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F5821F] py-3.5 text-sm font-bold text-[#060e1a] transition hover:bg-[#FFA94D] disabled:opacity-50"
        >
          {loading ? "Please wait..." : isSignUp ? "Register for Free Demo" : "Sign In"}
        </button>
      </form>

      {error && <p className="mt-4 text-sm font-semibold text-red-400">{error}</p>}

      <p className="mt-8 text-center text-sm font-semibold text-[#a8bdd4]">
        {isSignUp ? "Already have an account?" : "New to FitBeat?"}{" "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className="text-[#F5821F] hover:text-[#FFA94D]"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
