import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getRole } from "./constants";
import { verifyOTP } from "./otp";
import { redisGet, redisSet } from "./redis";
import type { User } from "./types";

const DEV_SECRET = "fitbeat-local-dev-secret-do-not-use-in-production";

function getAuthSecret() {
  return process.env.AUTH_SECRET || (process.env.NODE_ENV === "development" ? DEV_SECRET : undefined);
}

async function upsertUser(email: string, name: string) {
  const users = (await redisGet<Record<string, User>>("users")) || {};
  const key = email.toLowerCase();
  if (!users[key]) {
    users[key] = {
      email: key,
      name,
      role: getRole(key),
      dashboardAccess: false,
      joined: new Date().toISOString(),
    };
    await redisSet("users", users);
    await redisSet(`client:${key}`, { dietPlan: "", classes: [], progress: [], dietCalendar: [] });
  } else if (name && users[key].name !== name) {
    users[key].name = name;
    await redisSet("users", users);
  }
  return users[key];
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
      id: "otp",
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const code = credentials?.code as string;
        const name = (credentials?.name as string) || email.split("@")[0];
        if (!email || !code) return null;
        const valid = await verifyOTP(email, code);
        if (!valid) return null;
        const user = await upsertUser(email, name);
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
        const dbUser = await upsertUser(user.email, user.name || user.email.split("@")[0]);
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
