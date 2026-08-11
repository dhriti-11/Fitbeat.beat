import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import type { ContactMessage } from "@/lib/types";
import { uid } from "@/lib/utils";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const contacts = (await redisGet<ContactMessage[]>("contacts")) || [];
  contacts.push({ id: uid(), name, email, message, date: new Date().toISOString() });
  await redisSet("contacts", contacts);

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const to = process.env.CONTACT_EMAIL || "hello@fitbeat.studio";
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || "FitBeat <onboarding@resend.dev>",
        to,
        replyTo: email,
        subject: `FitBeat contact from ${name}`,
        text: `${message}\n\nFrom: ${name} (${email})`,
      });
    } catch {
      // Still saved to Redis
    }
  }

  return NextResponse.json({ ok: true });
}
