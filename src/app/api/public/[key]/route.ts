import { NextRequest, NextResponse } from "next/server";
import { redisGet } from "@/lib/redis";

const PUBLIC_KEYS = ["reviews", "updates"];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!PUBLIC_KEYS.includes(key)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const value = await redisGet(key);
  if (value === null) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ key, value });
}
