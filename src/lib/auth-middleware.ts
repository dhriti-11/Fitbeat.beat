import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  return session.user;
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), user: null };
  return { error: null, user };
}

export async function requireTrainer() {
  const result = await requireAuth();
  if (result.error) return result;
  if (result.user!.role !== "trainer") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), user: null };
  }
  return result;
}

export function canAccessKey(userEmail: string, role: string, key: string): boolean {
  if (role === "trainer") return true;
  if (key.startsWith("client:")) return key === `client:${userEmail.toLowerCase()}`;
  if (key.startsWith("messages:")) return key === `messages:${userEmail.toLowerCase()}`;
  if (key.startsWith("tasks:")) return key === `tasks:${userEmail.toLowerCase()}`;
  if (key === "leave-requests") return true;
  if (key === "users" || key === "appointments" || key === "updates" || key === "reviews" || key === "contacts") {
    return role === "trainer";
  }
  return false;
}
