import Link from "next/link";
import { clsx } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  asLink?: boolean;
};

const sizes = {
  sm: "text-xl tracking-wide",
  md: "text-2xl tracking-wide md:text-3xl",
  lg: "text-4xl tracking-wider md:text-5xl",
};

export function Logo({ className, size = "md", asLink = true }: LogoProps) {
  const inner = (
    <span
      className={clsx(
        "font-[family-name:var(--font-display)] font-extrabold uppercase",
        sizes[size],
        className
      )}
    >
      <span className="text-[#4FA3FF]">FIT</span>
      <span className="text-[#F5821F]">BEAT</span>
    </span>
  );

  if (asLink) {
    return <Link href="/">{inner}</Link>;
  }

  return inner;
}
