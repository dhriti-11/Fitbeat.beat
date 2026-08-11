import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  if (session.user.role === "trainer") redirect("/dashboard/trainer");
  if (!session.user.dashboardAccess) redirect("/dashboard/client/gate");
  redirect("/dashboard/client");
}
