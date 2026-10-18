import Link from "next/link";
import { cn } from "@/lib/utils";

export const paceButtonStyles = {
  primary: "bg-pace-ink text-white",
  green:
    "bg-pace-green text-white shadow-[0_3px_0_var(--color-pace-green-deep)] transition-[transform,box-shadow] duration-100 active:translate-y-[3px] active:shadow-[0_0_0_var(--color-pace-green-deep)]",
  secondary:
    "border-[1.5px] border-pace-line-strong bg-white text-pace-ink shadow-[0_3px_0_var(--color-pace-line-strong)]",
  ghost: "text-pace-ink",
};

export const paceButtonBase =
  "relative z-10 inline-flex h-10 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full px-[18px] text-sm font-bold leading-tight disabled:cursor-not-allowed disabled:opacity-50";

type PaceButtonProps = {
  href: string;
  variant?: keyof typeof paceButtonStyles;
  className?: string;
  children: React.ReactNode;
};

export function PaceButton({ href, variant = "green", className, children }: PaceButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        paceButtonBase,
        paceButtonStyles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
