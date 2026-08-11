import { clsx } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "grad" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
};

export function Button({ variant = "grad", size = "md", className, children, href, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-[family-name:var(--font-space)] font-bold uppercase tracking-[0.18em] transition-all duration-300 disabled:opacity-50";
  const sizes = { sm: "px-4 py-2 text-[10px]", md: "px-6 py-3 text-[11px]", lg: "px-8 py-4 text-xs" };
  const variants = {
    grad: "bg-gradient-to-r from-[#1E6FD9] to-[#F5821F] text-white hover:brightness-110",
    ghost: "border border-white/15 bg-transparent text-[#F3EFFF] hover:border-[#F5821F]/50 hover:bg-white/5",
    gold: "bg-[#F5821F] text-[#060e1a] hover:bg-[#FFA94D]",
  };

  const classes = clsx(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
