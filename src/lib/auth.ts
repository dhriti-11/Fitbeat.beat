import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createClientAppointment, type ClientProfile } from "./appointments";
import { getRole } from "./constants";
import { redisGet, redisSet } from "./redis";
import type { User } from "./types";

const DEV_SECRET = "fitbeat-local-dev-secret-do-not-use-in-production";

function getAuthSecret() {
  return process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? DEV_SECRET : undefined);
}

type ProfileInput = Pick<User, "age" | "country" | "state" | "city" | "phone">;

async function upsertUser(
  email: string,
  name: string,
  profile?: ProfileInput
): Promise<{ user: User; isNew: boolean }> {
  const users = (await redisGet<Record<string, User>>("users")) || {};
  const key = email.toLowerCase();
  if (!users[key]) {
    users[key] = {
      email: key,
      name,
      role: getRole(key),
      dashboardAccess: false,
      joined: new Date().toISOString(),
      ...profile,
    };
    await redisSet("users", users);
    await redisSet(`client:${key}`, { dietPlan: "", classes: [], progress: [], dietCalendar: [] });
    return { user: users[key], isNew: true };
  }

  if (name) users[key].name = name;
  if (profile) {
    if (profile.age !== undefined) users[key].age = profile.age;
    if (profile.country) users[key].country = profile.country;
    if (profile.state) users[key].state = profile.state;
    if (profile.city) users[key].city = profile.city;
    if (profile.phone) users[key].phone = profile.phone;
  }
  await redisSet("users", users);
  return { user: users[key], isNew: false };
}

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID) && Boolean(process.env.AUTH_GOOGLE_SECRET);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: getAuthSecret(),
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    Credentials({
      id: "email",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        age: { label: "Age", type: "text" },
        country: { label: "Country", type: "text" },
        state: { label: "State", type: "text" },
        city: { label: "City", type: "text" },
        phone: { label: "Phone", type: "text" },
        isSignUp: { label: "Sign Up", type: "text" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string)?.trim();
        const name = (credentials?.name as string)?.trim();
        const isSignUp = credentials?.isSignUp === "true";
        const ageRaw = credentials?.age as string | undefined;
        const age = ageRaw ? parseInt(ageRaw, 10) : undefined;
        const country = (credentials?.country as string)?.trim();
        const state = (credentials?.state as string)?.trim();
        const city = (credentials?.city as string)?.trim();
        const phone = (credentials?.phone as string)?.trim();

        if (!email || !name || !email.includes("@")) return null;

        if (isSignUp && (!age || !country || !state || !city)) return null;

        const profile: ProfileInput = isSignUp
          ? { age, country, state, city, phone: phone || undefined }
          : {};

        const { user, isNew } = await upsertUser(email, name, isSignUp ? profile : undefined);

        if (user.role === "client" && !user.dashboardAccess && isSignUp) {
          const apptProfile: ClientProfile = {
            email,
            name,
            age,
            country,
            state,
            city,
            phone,
          };
          await createClientAppointment(apptProfile);
        } else if (user.role === "client" && !user.dashboardAccess && isNew && !isSignUp) {
          await createClientAppointment({ email, name });
        }

        return {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role,
          dashboardAccess: user.dashboardAccess,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const { user: dbUser } = await upsertUser(user.email, user.name || user.email.split("@")[0]);
        user.role = dbUser.role;
        user.dashboardAccess = dbUser.dashboardAccess;
      }
      return true;
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = user.role;
        token.dashboardAccess = user.dashboardAccess;
      }
      if (trigger === "update" && token.email) {
        const users = (await redisGet<Record<string, User>>("users")) || {};
        const dbUser = users[token.email.toLowerCase()];
        if (dbUser) {
          token.role = dbUser.role;
          token.dashboardAccess = dbUser.dashboardAccess;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = (token.role as "trainer" | "client") || "client";
        session.user.dashboardAccess = Boolean(token.dashboardAccess);
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: { strategy: "jwt" },
});

export { googleConfigured };
