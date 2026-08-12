import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { requireAuth } from "@/lib/auth-middleware";
import type { Message } from "@/lib/types";
import { uid } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;
  const { searchParams } = new URL(req.url);
  const clientEmail = searchParams.get("clientEmail");

  if (user.role === "trainer") {
    if (!clientEmail) return NextResponse.json({ error: "clientEmail required" }, { status: 400 });
    const messages = (await redisGet<Message[]>(`messages:${clientEmail.toLowerCase()}`)) || [];
    return NextResponse.json({ messages });
  }

  const messages = (await redisGet<Message[]>(`messages:${user.email.toLowerCase()}`)) || [];
  return NextResponse.json({ messages });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;
  const { text, clientEmail, kind, subject } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: "text required" }, { status: 400 });

  const targetEmail = user.role === "trainer" ? clientEmail?.toLowerCase() : user.email.toLowerCase();
  if (!targetEmail) return NextResponse.json({ error: "clientEmail required" }, { status: 400 });

  const key = `messages:${targetEmail}`;
  const messages = (await redisGet<Message[]>(key)) || [];
  messages.push({
    id: uid(),
    from: user.email,
    text: text.trim(),
    timestamp: new Date().toISOString(),
    read: false,
    kind: kind || "chat",
    subject: subject?.trim() || undefined,
  });
  await redisSet(key, messages);
  return NextResponse.json({ ok: true, messages });
}
