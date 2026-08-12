import { DashboardIntroGate } from "@/components/intro/DashboardIntroGate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardIntroGate>{children}</DashboardIntroGate>;
}
