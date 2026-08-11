import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (session.user.role !== "trainer") redirect("/dashboard/client");
  return <>{children}</>;
}
