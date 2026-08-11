import { Resend } from "resend";
import { redisGet, redisSetWithTTL, redisDel } from "./redis";

const OTP_TTL = 600; // 10 minutes

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(email: string): Promise<{ ok: boolean; error?: string }> {
  const code = generateOTP();
  const stored = await redisSetWithTTL(`otp:${email.toLowerCase()}`, { code, expiresAt: Date.now() + OTP_TTL * 1000 }, OTP_TTL);
  if (!stored) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV OTP] ${email}: ${code}`);
      return { ok: true };
    }
    return {
      ok: false,
      error: "Storage unavailable. Add Upstash Redis to your Vercel project (KV_REST_API_URL + KV_REST_API_TOKEN).",
    };
  }

  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV OTP] ${email}: ${code}`);
      return { ok: true };
    }
    return { ok: false, error: "Email service not configured" };
  }

  const from = process.env.EMAIL_FROM || "FitBeat <onboarding@resend.dev>";
  try {
    await resend.emails.send({
      from,
      to: email,
      subject: "Your FitBeat sign-in code",
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0A1930;color:#F3EFFF;border-radius:16px;">
        <h1 style="color:#4FA3FF;">FitBeat</h1>
        <p>Your one-time sign-in code:</p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#F5821F;">${code}</p>
        <p style="color:#8FA9C7;font-size:14px;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>`,
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to send email" };
  }
}

export async function verifyOTP(email: string, code: string): Promise<boolean> {
  const data = await redisGet<{ code: string; expiresAt: number }>(`otp:${email.toLowerCase()}`);
  if (!data) {
    // Dev fallback
    if (process.env.NODE_ENV === "development" && code.length === 6) return true;
    return false;
  }
  if (Date.now() > data.expiresAt) {
    await redisDel(`otp:${email.toLowerCase()}`);
    return false;
  }
  const valid = data.code === code;
  if (valid) await redisDel(`otp:${email.toLowerCase()}`);
  return valid;
}
