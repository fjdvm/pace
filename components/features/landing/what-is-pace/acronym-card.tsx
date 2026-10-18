import { cn } from "@/lib/utils";

type AcronymCardProps = {
  letter: string;
  title: string;
  description: string;
  className: string;
  letterClassName: string;
};

export function AcronymCard({
  letter,
  title,
  description,
  className,
  letterClassName,
}: AcronymCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2.5 rounded-[32px] px-7 pb-7 pt-6 transition-transform duration-300 hover:-translate-y-1",
        className,
      )}
    >
      <p
        className={cn(
          "font-pace-display text-[72px] font-medium leading-[1.02] tracking-[-0.03em]",
          letterClassName,
        )}
      >
        {letter}
      </p>
      <p className="pace-h4 text-pace-ink">{title}</p>
      <p className="pace-body text-pace-ink-2">{description}</p>
    </div>
  );
}
