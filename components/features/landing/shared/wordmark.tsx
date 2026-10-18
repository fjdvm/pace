import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-pace-display text-[28px] font-medium leading-none tracking-[-0.03em] text-pace-ink",
        className,
      )}
    >
      Pace
    </Link>
  );
}
