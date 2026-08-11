import type { Metadata } from "next";
import { Syne, Nunito_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MeshBackground } from "@/components/ui/MeshBackground";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const space = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitBeat — Train to the Rhythm",
  description: "Personalized fitness coaching for women, teens and kids. Live classes, diet plans, and progress tracking across Kuwait, Qatar and Morbi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${nunito.variable} ${space.variable}`}>
      <body className="relative min-h-screen">
        <MeshBackground />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
