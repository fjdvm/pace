import { cn } from "@/lib/utils";

const fills = {
  green: "bg-pace-green",
  amber: "bg-pace-amber",
  red: "bg-pace-red",
  purple: "bg-pace-purple",
};

type ProgressBarProps = {
  value: number;
  tone?: keyof typeof fills;
  className?: string;
};

export function ProgressBar({ value, tone = "green", className }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-pace-sunken", className)}>
      <div
        className={cn("h-full rounded-full", fills[tone])}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
