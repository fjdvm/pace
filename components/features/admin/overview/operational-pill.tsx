import { cn } from "@/lib/utils";

export function OperationalPill({ operational }: { operational: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold",
        operational ? "bg-pace-green-tint text-pace-green-deep" : "bg-pace-red-tint text-pace-red",
      )}
    >
      <span className={cn("size-1.5 rounded-full", operational ? "bg-pace-green" : "bg-pace-red")} />
      {operational ? "All systems operational" : "Attention needed"}
    </span>
  );
}
