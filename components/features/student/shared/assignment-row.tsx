import Link from "next/link";
import { cn } from "@/lib/utils";
import { PaceIcon } from "./pace-icon";

type AssignmentRowProps = {
  href: string;
  icon: "code-green" | "code-purple" | "check-18" | "code-gray";
  iconTone?: "green" | "purple" | "sunken";
  title: string;
  subtitle: string;
  children?: React.ReactNode;
  className?: string;
};

const tones = {
  green: "bg-pace-green-tint",
  purple: "bg-pace-purple-tint",
  sunken: "bg-pace-sunken",
};

export function AssignmentRow({
  href,
  icon,
  iconTone = "green",
  title,
  subtitle,
  children,
  className,
}: AssignmentRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3.5 rounded-2xl border-[1.5px] border-pace-line bg-white px-5 py-4",
        className,
      )}
    >
      <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tones[iconTone])}>
        <PaceIcon name={icon} size={18} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-[15px] font-semibold leading-snug text-pace-ink">{title}</span>
        <span className="truncate text-[13px] text-pace-muted">{subtitle}</span>
      </span>
      {children}
    </Link>
  );
}
