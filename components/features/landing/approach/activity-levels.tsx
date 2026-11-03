import { cn } from "@/lib/utils";

const levels = [
  { label: "Low", className: "bg-pace-night text-pace-cream" },
  { label: "Medium", className: "bg-pace-sun text-pace-ink" },
  { label: "High", className: "animate-pace-bob bg-pace-red text-white" },
];

export function ActivityLevels() {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {levels.map((level) => (
        <span
          key={level.label}
          className={cn("pace-small rounded-full px-3 py-1.5 font-semibold", level.className)}
        >
          {level.label}
        </span>
      ))}
      <span className="pace-small pl-1 text-pace-cream">activity level</span>
    </div>
  );
}
