import { redisGet, redisSet } from "./redis";
import type { Appointment } from "./types";
import { uid } from "./utils";

export type ClientProfile = {
  name: string;
  email: string;
  age?: number;
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
};

export async function createClientAppointment(profile: ClientProfile): Promise<boolean> {
  const key = profile.email.toLowerCase();
  const all = (await redisGet<Appointment[]>("appointments")) || [];
  const exists = all.some((a) => a.email.toLowerCase() === key);
  if (exists) return false;

  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");

  all.push({
    id: uid(),
    name: profile.name,
    email: key,
    phone: profile.phone || "",
    date: "",
    trainer: "No preference",
    note: location ? `Registered via sign-up · ${location}` : "Registered via sign-up",
    type: "demo",
    status: "pending",
    age: profile.age,
    country: profile.country,
    state: profile.state,
    city: profile.city,
  });
  await redisSet("appointments", all);
  return true;
}

/** @deprecated Use createClientAppointment */
export async function ensurePendingAppointment(email: string, name: string): Promise<boolean> {
  return createClientAppointment({ email, name });
}
