import { cn } from "@/lib/utils";
import { classColour } from "@/lib/class-colour";

type ClassDotProps = {
  classId: string;
  name: string;
  className?: string;
};

export function ClassDot({ classId, name, className }: ClassDotProps) {
  return (
    <span
      aria-hidden
      style={{ backgroundColor: classColour(classId) }}
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-base font-bold leading-[1.35] tracking-[-0.005em] text-white",
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
