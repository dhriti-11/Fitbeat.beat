import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { requireAuth, requireTrainer } from "@/lib/auth-middleware";
import type { LeaveRequest } from "@/lib/types";
import { uid } from "@/lib/utils";

const KEY = "leave-requests";

export async function GET() {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;

  const all = (await redisGet<LeaveRequest[]>(KEY)) || [];

  if (user.role === "trainer") {
    return NextResponse.json({ requests: all });
  }

  const mine = all.filter((r) => r.clientEmail.toLowerCase() === user.email.toLowerCase());
  return NextResponse.json({ requests: mine });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;

  const body = await req.json();

  if (user.role === "trainer" && body.action === "review") {
    const all = (await redisGet<LeaveRequest[]>(KEY)) || [];
    const req_ = all.find((r) => r.id === body.id);
    if (!req_) return NextResponse.json({ error: "not found" }, { status: 404 });
    req_.status = body.status === "approved" ? "approved" : "denied";
    req_.reviewedAt = new Date().toISOString();
    await redisSet(KEY, all);
    return NextResponse.json({ requests: all });
  }

  if (user.role !== "client") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { classId, className, classDatetime, reason } = body;
  if (!classId || !className || !classDatetime || !reason?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const all = (await redisGet<LeaveRequest[]>(KEY)) || [];
  const duplicate = all.find(
    (r) =>
      r.clientEmail.toLowerCase() === user.email.toLowerCase() &&
      r.classId === classId &&
      r.status === "pending"
  );
  if (duplicate) {
    return NextResponse.json({ error: "Leave request already pending for this session" }, { status: 409 });
  }

  const entry: LeaveRequest = {
    id: uid(),
    clientEmail: user.email.toLowerCase(),
    clientName: user.name || user.email,
    classId,
    className,
    classDatetime,
    reason: reason.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  all.unshift(entry);
  await redisSet(KEY, all);
  return NextResponse.json({ ok: true, requests: all.filter((r) => r.clientEmail === user.email.toLowerCase()) });
}
