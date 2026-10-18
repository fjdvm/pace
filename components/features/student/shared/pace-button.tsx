import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary: "bg-pace-ink text-white",
  green: "bg-pace-green text-white shadow-[0_3px_0_var(--color-pace-green-deep)]",
  secondary:
    "border-[1.5px] border-pace-line-strong bg-white text-pace-ink shadow-[0_3px_0_var(--color-pace-line-strong)]",
  ghost: "text-pace-ink",
};

type PaceButtonProps = {
  href: string;
  variant?: keyof typeof styles;
  className?: string;
  children: React.ReactNode;
};

export function PaceButton({ href, variant = "green", className, children }: PaceButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative z-10 inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-[18px] text-sm font-bold leading-tight",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
