import { clsx } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "grad" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  href?: string;
};

export function Button({ variant = "grad", size = "md", className, children, href, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 disabled:opacity-50";
  const sizes = { sm: "px-4 py-2 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" };
  const variants = {
    grad: "bg-gradient-to-br from-[#1E6FD9] to-[#F5821F] text-white hover:-translate-y-0.5 hover:brightness-110",
    ghost: "glass text-[#F3EFFF] hover:border-[#4FA3FF]",
    gold: "bg-gradient-to-br from-[#F5821F] to-[#FFA94D] text-[#1a0f00] hover:-translate-y-0.5",
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
