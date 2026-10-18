import { cn } from "@/lib/utils";

type PillProps = {
  children: React.ReactNode;
  className?: string;
};

export function Pill({ children, className }: PillProps) {
  return (
    <span
      className={cn(
        "pace-small inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}
