"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ClassCalendar } from "@/components/dashboard/ClassCalendar";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { MessageThread } from "@/components/dashboard/MessageThread";
import { TaskList } from "@/components/dashboard/TaskList";
import { YogaLibrary } from "@/components/dashboard/YogaLibrary";
import { storageGet, storageSet } from "@/lib/storage-client";
import type { User, ClientData, Appointment, Update, ClassEvent, ProgressPoint } from "@/lib/types";
import { formatDate, uid } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Overview", icon: "🏠" },
  { id: "clients", label: "My Clients", icon: "👥" },
  { id: "appointments", label: "Appointments", icon: "🗓" },
  { id: "updates", label: "Post Updates", icon: "📣" },
  { id: "yoga", label: "Yoga Library", icon: "🧘" },
];

export default function TrainerDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [active, setActive] = useState("overview");
  const [users, setUsers] = useState<Record<string, User>>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [updateText, setUpdateText] = useState("");

  // Client detail form state
  const [dietPlan, setDietPlan] = useState("");
  const [classForm, setClassForm] = useState({ name: "", datetime: "", zoom: "" });
  const [progressForm, setProgressForm] = useState({ label: "", value: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/sign-in");
    if (status === "authenticated" && session.user.role !== "trainer") {
      router.push("/dashboard/client");
    }
  }, [status, session, router]);

  async function loadAll() {
    const u = await storageGet<Record<string, User>>("users");
    setUsers(u || {});
    const r = await fetch("/api/appointments");
    const d = await r.json();
    setAppointments(d.appointments || []);
    const ups = await storageGet<Update[]>("updates");
    setUpdates(ups || []);
  }

  useEffect(() => {
    if (status === "authenticated") loadAll();
  }, [status]);

  async function loadClient(email: string) {
    setSelectedClient(email);
    setActive("client-detail");
    const data = await storageGet<ClientData>(`client:${email}`);
    setClientData(data || { dietPlan: "", classes: [], progress: [], dietCalendar: [] });
    setDietPlan(data?.dietPlan || "");
  }

  async function toggleAccess(email: string) {
    const all = { ...users };
    if (!all[email]) return;
    all[email].dashboardAccess = !all[email].dashboardAccess;
    await storageSet("users", all);
    setUsers(all);
  }

  async function saveDiet() {
    if (!selectedClient) return;
    const data = { ...(clientData || { dietPlan: "", classes: [], progress: [], dietCalendar: [] }), dietPlan };
    await storageSet(`client:${selectedClient}`, data);
    setClientData(data);
  }

  async function addClass(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClient || !classForm.name || !classForm.datetime) return;
    const data = clientData || { dietPlan: "", classes: [], progress: [], dietCalendar: [] };
    data.classes.push({
      id: uid(),
      name: classForm.name,
      datetime: classForm.datetime,
      zoom: classForm.zoom,
      trainer: session?.user?.name || "",
    });
    await storageSet(`client:${selectedClient}`, data);
    setClientData({ ...data });
    setClassForm({ name: "", datetime: "", zoom: "" });
  }

  async function removeClass(id: string) {
    if (!selectedClient || !clientData) return;
    const data = { ...clientData, classes: clientData.classes.filter((c) => c.id !== id) };
    await storageSet(`client:${selectedClient}`, data);
    setClientData(data);
  }

  async function logProgress(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedClient || !progressForm.label || !progressForm.value) return;
    const data = clientData || { dietPlan: "", classes: [], progress: [], dietCalendar: [] };
    data.progress.push({
      label: progressForm.label,
      value: parseFloat(progressForm.value),
      date: new Date().toISOString(),
    });
    await storageSet(`client:${selectedClient}`, data);
    setClientData({ ...data });
    setProgressForm({ label: "", value: "" });
  }

  async function postUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!updateText.trim()) return;
    const newUpdates = [
      { id: uid(), text: updateText, trainer: session?.user?.name || "Trainer", date: new Date().toISOString() },
      ...updates,
    ];
    await storageSet("updates", newUpdates);
    setUpdates(newUpdates);
    setUpdateText("");
  }

  async function updateApptStatus(id: string, status: Appointment["status"]) {
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadAll();
  }

  if (status === "loading" || !session) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  const clients = Object.values(users).filter((u) => u.role === "client");

  if (active === "client-detail" && selectedClient) {
    const client = users[selectedClient];
    return (
      <DashboardShell
        title={client?.name || selectedClient}
        subtitle={selectedClient}
        nav={[{ id: "back", label: "← Back to Clients" }, ...NAV.slice(1)]}
        active="back"
        onNav={(id) => { if (id === "back") { setActive("clients"); setSelectedClient(null); } else setActive(id); }}
      >
        <div className="space-y-8">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold">Dashboard Access</h3>
            <p className="mt-1 text-sm text-[#8FA9C7]">
              Status: {client?.dashboardAccess ? "✓ Approved" : "⏳ Pending"}
            </p>
            <button
              onClick={() => toggleAccess(selectedClient)}
              className="mt-3 rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] px-5 py-2 text-sm font-bold"
            >
              {client?.dashboardAccess ? "Revoke Access" : "Grant Access"}
            </button>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold">Diet Plan</h3>
            <textarea
              value={dietPlan}
              onChange={(e) => setDietPlan(e.target.value)}
              rows={6}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
              placeholder="Write the client's diet plan..."
            />
            <button onClick={saveDiet} className="mt-3 rounded-full bg-[#1E6FD9] px-5 py-2 text-sm font-bold">Save Diet Plan</button>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold">Add Class</h3>
            <form onSubmit={addClass} className="mt-3 grid gap-3 md:grid-cols-3">
              <input required placeholder="Class Name" value={classForm.name} onChange={(e) => setClassForm({ ...classForm, name: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none" />
              <input required type="datetime-local" value={classForm.datetime} onChange={(e) => setClassForm({ ...classForm, datetime: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none" />
              <input placeholder="Zoom Link" value={classForm.zoom} onChange={(e) => setClassForm({ ...classForm, zoom: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none" />
              <button type="submit" className="rounded-full bg-[#F5821F] px-5 py-2 text-sm font-bold md:col-span-3">Add to Calendar</button>
            </form>
            <ClassCalendar events={clientData?.classes || []} />
            <div className="mt-4 space-y-2">
              {(clientData?.classes || []).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-2 text-sm">
                  <span>{c.name} · {formatDate(c.datetime)}</span>
                  <button onClick={() => removeClass(c.id)} className="text-red-400">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h3 className="font-bold">Progress Tracker</h3>
            <form onSubmit={logProgress} className="mt-3 flex flex-wrap gap-3">
              <input required placeholder="Metric (e.g. Weight kg)" value={progressForm.label} onChange={(e) => setProgressForm({ ...progressForm, label: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none" />
              <input required type="number" step="0.1" placeholder="Value" value={progressForm.value} onChange={(e) => setProgressForm({ ...progressForm, value: e.target.value })} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none" />
              <button type="submit" className="rounded-full bg-[#1E6FD9] px-5 py-2 text-sm font-bold">Log Progress</button>
            </form>
            <div className="mt-4"><ProgressChart data={clientData?.progress || []} /></div>
          </div>

          <div>
            <h3 className="mb-3 font-bold">Tasks</h3>
            <TaskList clientEmail={selectedClient} isTrainer={true} />
          </div>

          <div>
            <h3 className="mb-3 font-bold">Messages</h3>
            <MessageThread clientEmail={selectedClient} currentUserEmail={session.user.email!} isTrainer={true} />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={`Welcome back, ${session.user.name?.split(" ")[0] || "Trainer"}`}
      subtitle="Trainer dashboard"
      nav={NAV}
      active={active}
      onNav={setActive}
    >
      {active === "overview" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[#8FA9C7]">Active Clients</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold grad-text">{clients.filter((c) => c.dashboardAccess).length}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="text-sm text-[#8FA9C7]">Pending Appointments</p>
            <p className="font-[family-name:var(--font-display)] text-3xl font-bold grad-text">{appointments.filter((a) => a.status === "pending").length}</p>
          </div>
          <div className="glass rounded-2xl p-6 md:col-span-2">
            <h3 className="font-bold">Recent client activity</h3>
            <div className="mt-3 space-y-2">
              {clients.slice(0, 5).map((c) => (
                <button key={c.email} onClick={() => loadClient(c.email)} className="flex w-full items-center justify-between rounded-xl bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                  <span>{c.name}</span>
                  <span className={c.dashboardAccess ? "text-[#38BDF8]" : "text-[#FFA94D]"}>{c.dashboardAccess ? "Approved" : "Pending"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {active === "clients" && (
        <div className="space-y-3">
          {clients.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-[#8FA9C7]">No clients yet.</div>
          ) : (
            clients.map((c) => (
              <button
                key={c.email}
                onClick={() => loadClient(c.email)}
                className="glass flex w-full items-center justify-between rounded-2xl p-5 text-left transition hover:border-[#4FA3FF]/30"
              >
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-[#8FA9C7]">{c.email}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${c.dashboardAccess ? "bg-[#38BDF8]/20 text-[#38BDF8]" : "bg-[#FFA94D]/20 text-[#FFA94D]"}`}>
                  {c.dashboardAccess ? "Approved" : "Pending"}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {active === "appointments" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#8FA9C7]">
                <th className="p-3">Name</th>
                <th className="p-3">Age</th>
                <th className="p-3">Location</th>
                <th className="p-3">Type</th>
                <th className="p-3">Date</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b border-white/5">
                  <td className="p-3">{a.name}</td>
                  <td className="p-3">{a.age ?? "—"}</td>
                  <td className="p-3">
                    {[a.city, a.state, a.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="p-3">{a.type}</td>
                  <td className="p-3">{a.date ? formatDate(a.date) : "TBD"}</td>
                  <td className="p-3">{a.email}<br />{a.phone || "—"}</td>
                  <td className="p-3">
                    <select
                      value={a.status}
                      onChange={(e) => updateApptStatus(a.id, e.target.value as Appointment["status"])}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className="glass mt-4 rounded-2xl p-6 text-[#8FA9C7]">No appointments yet.</div>
          )}
        </div>
      )}

      {active === "updates" && (
        <div className="space-y-6">
          <form onSubmit={postUpdate} className="glass rounded-2xl p-6">
            <h3 className="font-bold">Post an Update</h3>
            <textarea
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              rows={3}
              placeholder="Write an announcement for all clients..."
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
            />
            <button type="submit" className="mt-3 rounded-full bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] px-5 py-2 text-sm font-bold">Post to All Clients</button>
          </form>
          <div className="space-y-3">
            {updates.map((u) => (
              <div key={u.id || u.date} className="glass rounded-2xl p-5">
                <p>{u.text}</p>
                <p className="mt-2 text-xs text-[#8FA9C7]">{formatDate(u.date)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === "yoga" && <YogaLibrary />}
    </DashboardShell>
  );
}
