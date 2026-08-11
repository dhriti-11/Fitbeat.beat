import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet, redisDel, redisKeys } from "@/lib/redis";
import { requireAuth, canAccessKey } from "@/lib/auth-middleware";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const list = searchParams.get("list");
  const prefix = searchParams.get("prefix") || "";

  if (list === "true") {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    if (authResult.user!.role !== "trainer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const keys = await redisKeys(prefix);
    return NextResponse.json({ keys });
  }

  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  const authResult = await requireAuth();
  if (authResult.error && !["reviews", "updates"].includes(key)) {
    return authResult.error;
  }
  if (authResult.user && !canAccessKey(authResult.user.email, authResult.user.role, key)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const value = await redisGet(key);
  if (value === null) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ key, value });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  const user = authResult.user!;
  if (!canAccessKey(user.email, user.role, key)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Trainers can write client data; clients can only update their own task completion via tasks API
  if (user.role === "client" && !key.startsWith(`client:${user.email.toLowerCase()}`)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await redisSet(key, value);
  return NextResponse.json({ key, value });
}

export async function DELETE(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  if (authResult.user!.role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  await redisDel(key);
  return NextResponse.json({ key, deleted: true });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
