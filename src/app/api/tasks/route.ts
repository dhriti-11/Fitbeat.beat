import { NextRequest, NextResponse } from "next/server";
import { redisGet, redisSet } from "@/lib/redis";
import { requireAuth } from "@/lib/auth-middleware";
import type { Task } from "@/lib/types";
import { uid } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;
  const { searchParams } = new URL(req.url);
  const clientEmail = searchParams.get("clientEmail");
  const email = user.role === "trainer" ? clientEmail?.toLowerCase() : user.email.toLowerCase();
  if (!email) return NextResponse.json({ error: "clientEmail required" }, { status: 400 });
  const tasks = (await redisGet<Task[]>(`tasks:${email}`)) || [];
  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult.error) return authResult.error;
  const user = authResult.user!;
  const body = await req.json();
  const clientEmail = (user.role === "trainer" ? body.clientEmail : user.email)?.toLowerCase();
  if (!clientEmail) return NextResponse.json({ error: "clientEmail required" }, { status: 400 });

  const key = `tasks:${clientEmail}`;
  const tasks = (await redisGet<Task[]>(key)) || [];

  if (body.action === "toggle" && body.taskId) {
    const task = tasks.find((t) => t.id === body.taskId);
    if (!task) return NextResponse.json({ error: "not found" }, { status: 404 });
    task.completed = !task.completed;
    await redisSet(key, tasks);
    return NextResponse.json({ tasks });
  }

  if (user.role !== "trainer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (body.action === "delete" && body.taskId) {
    const filtered = tasks.filter((t) => t.id !== body.taskId);
    await redisSet(key, filtered);
    return NextResponse.json({ tasks: filtered });
  }

  if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });
  tasks.push({
    id: uid(),
    title: body.title,
    dueDate: body.dueDate || new Date().toISOString(),
    completed: false,
    assignedBy: user.email,
  });
  await redisSet(key, tasks);
  return NextResponse.json({ tasks });
}
