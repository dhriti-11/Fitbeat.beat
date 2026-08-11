import { NextRequest, NextResponse } from "next/server";
import { sendOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  const { email, action } = await req.json();
  if (!email || action !== "send") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const result = await sendOTP(email);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ ok: true });
}
