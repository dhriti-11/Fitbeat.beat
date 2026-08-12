"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ClassCalendar } from "@/components/dashboard/ClassCalendar";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { TaskList } from "@/components/dashboard/TaskList";
import { YogaLibrary } from "@/components/dashboard/YogaLibrary";
import { LeaveRequestPanel } from "@/components/dashboard/LeaveRequestPanel";
import { storageGet } from "@/lib/storage-client";
import { QUOTES } from "@/lib/constants";
import type { ClientData, Update, Appointment, LeaveRequest } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "diet", label: "Diet Plan", icon: "🥗" },
  { id: "calendar", label: "Classes & Schedule", icon: "📅" },
  { id: "progress", label: "My Progress", icon: "📈" },
  { id: "tasks", label: "Tasks", icon: "✅" },
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "updates", label: "Announcements", icon: "📣" },
  { id: "appointments", label: "Appointments", icon: "🗓" },
  { id: "yoga", label: "Yoga Library", icon: "🧘" },
];

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("overview");
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const email = session?.user?.email?.toLowerCase() || "";

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-in");
    if (status === "authenticated") {
      if (session.user.role === "trainer") router.push("/dashboard/trainer");
      else if (!session.user.dashboardAccess) router.push("/dashboard/client/gate");
    }
  }, [status, session, router]);

  const loadClientData = useCallback(async () => {
    if (!email) return;
    const data = await storageGet<ClientData>(`client:${email}`);
    setClientData(data || { dietPlan: "", classes: [], progress: [], dietCalendar: [] });
  }, [email]);

  useEffect(() => {
    if (!email) return;
    async function load() {
      await loadClientData();
      const ups = await storageGet<Update[]>("updates");
      setUpdates(ups || []);
      const r = await fetch("/api/appointments");
      const d = await r.json();
      setAppointments(d.appointments || []);
      const lr = await fetch("/api/leave-requests");
      const lrd = await lr.json();
      setLeaveRequests(lrd.requests || []);
    }
    load();
  }, [email, loadClientData]);

  useEffect(() => {
    if (!email || active !== "calendar") return;
    const t = setInterval(loadClientData, 12000);
    return () => clearInterval(t);
  }, [email, active, loadClientData]);

  if (status === "loading" || !session) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const upcoming = (clientData?.classes || [])
    .filter((c) => new Date(c.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];

  return (
    <DashboardShell
      title={`Hey, ${session.user.name?.split(" ")[0] || "there"} 👋`}
      subtitle="Your personalized FitBeat dashboard"
      nav={NAV}
      active={active}
      onNav={setActive}
    >
      {active === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[#8FA9C7]">Upcoming Classes</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold grad-text">{clientData?.classes?.length || 0}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[#8FA9C7]">New Updates</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold grad-text">{updates.length}</p>
          </div>
          {upcoming && (
            <div className="glass rounded-2xl p-6 md:col-span-2">
              <h3 className="font-bold">Your next class</h3>
              <p className="mt-2 text-[#4FA3FF]">{upcoming.name}</p>
              <p className="text-sm text-[#8FA9C7]">{formatDate(upcoming.datetime)}</p>
              {upcoming.zoom && (
                <a href={upcoming.zoom} target="_blank" rel="noopener" className="mt-2 inline-block text-sm text-[#F5821F]">
                  Join Zoom →
                </a>
              )}
            </div>
          )}
          <div className="glass rounded-2xl p-6 md:col-span-2">
            <h3 className="font-bold">Motivation for today</h3>
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg text-[#4FA3FF]">{quote}</p>
          </div>
        </div>
      )}

      {active === "diet" && (
        <div className="glass rounded-2xl p-6">
          {clientData?.dietPlan ? (
            <pre className="whitespace-pre-wrap font-[family-name:var(--font-body)] text-sm leading-relaxed">{clientData.dietPlan}</pre>
          ) : (
            <p className="text-[#8FA9C7]">Your trainer hasn&apos;t assigned a diet plan yet.</p>
          )}
          {clientData?.dietCalendar?.length ? (
            <div className="mt-6">
              <h3 className="mb-3 font-bold">Weekly Meal Plan</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {clientData.dietCalendar.map((e) => (
                  <div key={e.id} className="rounded-xl bg-white/5 p-3 text-sm">
                    <span className="text-[#4FA3FF]">{e.day} · {e.meal}</span>
                    <p className="text-[#8FA9C7]">{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {active === "calendar" && (
        <div className="space-y-6">
          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-[#8FA9C7]">
              Your calendar updates automatically when your trainer adds or changes sessions.
            </p>
          </div>
          <ClassCalendar events={clientData?.classes || []} leaveRequests={leaveRequests} />
          <LeaveRequestPanel classes={clientData?.classes || []} isTrainer={false} />
        </div>
      )}

      {active === "progress" && <ProgressChart data={clientData?.progress || []} />}

      {active === "tasks" && <TaskList clientEmail={email} isTrainer={false} />}

      {active === "messages" && (
        <MessageThread clientEmail={email} currentUserEmail={email} isTrainer={false} />
      )}

      {active === "updates" && (
        <div className="space-y-3">
          {updates.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-[#8FA9C7]">No announcements yet.</div>
          ) : (
            updates.map((u) => (
              <div key={u.id || u.date} className="glass rounded-2xl p-5">
                <p>{u.text}</p>
                <p className="mt-2 text-xs text-[#8FA9C7]">{u.trainer} · {formatDate(u.date)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {active === "appointments" && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-[#8FA9C7]">No appointments booked yet.</div>
          ) : (
            appointments.map((a) => (
              <div key={a.id} className="glass rounded-2xl p-5">
                <p className="font-bold">{a.type === "demo" ? "Free Demo" : "Diet Consult"}</p>
                <p className="text-sm text-[#8FA9C7]">{formatDate(a.date)} · {a.status}</p>
                {a.note && <p className="mt-1 text-sm">{a.note}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {active === "yoga" && <YogaLibrary />}
    </DashboardShell>
  );
}
