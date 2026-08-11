import type { Metadata, Viewport } from "next";
import { Unbounded, Figtree, Outfit } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { MeshBackground } from "@/components/ui/MeshBackground";
import { GrainOverlay } from "@/components/ui/GrainOverlay";

const display = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const accent = Outfit({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "FitBeat — Train to the Rhythm",
  description: "Personalized fitness coaching for women, teens and kids. Live classes, diet plans, and progress tracking across Kuwait, Qatar and Morbi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060e1a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${accent.variable}`}>
      <body className="relative min-h-screen bg-[#060e1a]">
        <MeshBackground />
        <GrainOverlay />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
