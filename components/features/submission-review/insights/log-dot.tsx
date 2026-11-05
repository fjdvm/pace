import { cn } from "@/lib/utils";
import type { LogTone } from "@/lib/insights/activity";

const tones: Record<LogTone, string> = {
  muted: "bg-pace-line-strong",
  amber: "bg-pace-amber",
  red: "bg-pace-red",
  purple: "bg-pace-purple",
  green: "bg-pace-green",
};

export function LogDot({ tone, className }: { tone: LogTone; className?: string }) {
  return <span className={cn("shrink-0 rounded-full", tones[tone], className)} />;
}
