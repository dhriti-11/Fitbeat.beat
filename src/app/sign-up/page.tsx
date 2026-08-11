"use client";

import { motion } from "framer-motion";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignUpPage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <AuthForm mode="signup" />
      </motion.div>
    </main>
  );
}
