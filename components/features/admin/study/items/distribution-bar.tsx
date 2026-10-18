import { cn } from "@/lib/utils";
import { likertFills } from "./likert-colors";

const LABEL_THRESHOLD = 8;

export function DistributionBar({ distribution }: { distribution: number[] }) {
  return (
    <div
      className="flex h-7 w-full overflow-hidden rounded-lg bg-pace-sunken"
      role="img"
      aria-label={distribution.map((v, i) => `${i + 1}: ${Math.round(v)}%`).join(", ")}
    >
      {distribution.map((value, i) =>
        value > 0 ? (
          <span
            key={i}
            className={cn("flex items-center justify-center text-[11px] font-bold text-pace-ink", likertFills[i])}
            style={{ width: `${value}%` }}
          >
            {value >= LABEL_THRESHOLD ? `${Math.round(value)}%` : ""}
          </span>
        ) : null,
      )}
    </div>
  );
}
