import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  tone?: "green" | "amber";
  className?: string;
};

export function ProgressBar({ value, tone = "green", className }: ProgressBarProps) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-pace-sunken", className)}>
      <div
        className={cn("h-full rounded-full", tone === "green" ? "bg-pace-green" : "bg-pace-amber")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
