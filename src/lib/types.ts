export type UserRole = "trainer" | "client";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  dashboardAccess: boolean;
  joined: string;
  age?: number;
  country?: string;
  state?: string;
  city?: string;
  phone?: string;
}

export interface ClassEvent {
  id: string;
  name: string;
  datetime: string;
  zoom?: string;
  trainer?: string;
}

export interface ProgressPoint {
  label: string;
  value: number;
  date: string;
}

export interface DietCalendarEntry {
  id: string;
  day: string;
  meal: string;
  description: string;
}

export interface ClientData {
  dietPlan: string;
  classes: ClassEvent[];
  progress: ProgressPoint[];
  dietCalendar: DietCalendarEntry[];
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  trainer: string;
  note: string;
  type: "demo" | "diet";
  status: "pending" | "confirmed" | "completed";
  age?: number;
  country?: string;
  state?: string;
  city?: string;
}

export interface Update {
  id: string;
  text: string;
  trainer: string;
  date: string;
}

export interface Review {
  name: string;
  rating: number;
  text: string;
}

export type MessageKind = "chat" | "diet" | "workout" | "reminder" | "personal";

export interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  read: boolean;
  kind?: MessageKind;
  subject?: string;
}

export interface LeaveRequest {
  id: string;
  clientEmail: string;
  clientName: string;
  classId: string;
  className: string;
  classDatetime: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  createdAt: string;
  reviewedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  assignedBy: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
