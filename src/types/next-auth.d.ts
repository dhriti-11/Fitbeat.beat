import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "trainer" | "client";
      dashboardAccess: boolean;
    } & DefaultSession["user"];
  }
  interface User {
    role?: "trainer" | "client";
    dashboardAccess?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: "trainer" | "client";
    dashboardAccess?: boolean;
  }
}
