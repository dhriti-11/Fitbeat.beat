import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { requireAuth } from "@/lib/auth-middleware";
import type { Appointment } from "@/lib/types";
import { uid } from "@/lib/utils";

export async function GET() {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;
  const all = (await redisGet<Appointment[]>("appointments")) || [];
  if (user.role === "trainer") return NextResponse.json({ appointments: all });
  const mine = all.filter((a) => a.email.toLowerCase() === user.email.toLowerCase());
  return NextResponse.json({ appointments: mine });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Public booking (no auth required)
  if (body.public) {
    const { name, email, phone, date, trainer, note, type, age, country, state, city } = body;
    if (!name || !email || !date) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const all = (await redisGet<Appointment[]>("appointments")) || [];
    all.push({
      id: uid(),
      name,
      email: email.toLowerCase(),
      phone: phone || "",
      date,
      trainer: trainer || "No preference",
      note: note || "",
      type: type || "demo",
      status: "pending",
      age: age ? parseInt(age, 10) : undefined,
      country: country || undefined,
      state: state || undefined,
      city: city || undefined,
    });
    await redisSet("appointments", all);
    return NextResponse.json({ ok: true });
  }

  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  if (authResult.user!.role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status } = body;
  const all = (await redisGet<Appointment[]>("appointments")) || [];
  const appt = all.find((a) => a.id === id);
  if (!appt) return NextResponse.json({ error: "not found" }, { status: 404 });
  appt.status = status;
  await redisSet("appointments", all);
  return NextResponse.json({ ok: true, appointments: all });
}
