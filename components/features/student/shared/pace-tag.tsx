import { cn } from "@/lib/utils";

const tones = {
  green: "bg-pace-green-tint text-pace-green-deep",
  red: "bg-pace-red-tint text-pace-red",
  amber: "bg-pace-amber-tint text-pace-ink",
  neutral: "bg-pace-sunken text-pace-ink-2",
};

type PaceTagProps = {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
};

export function PaceTag({ tone = "green", className, children }: PaceTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold leading-normal",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
