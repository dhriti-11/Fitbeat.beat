import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import type { Review } from "@/lib/types";

export async function GET() {
  const reviews = (await redisGet<Review[]>("reviews")) || [];
  return NextResponse.json({ reviews });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, text, rating } = body;
  if (!name || !text) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const reviews = (await redisGet<Review[]>("reviews")) || [];
  reviews.push({ name, text, rating: rating || 5 });
  await redisSet("reviews", reviews);
  return NextResponse.json({ ok: true, reviews });
}
