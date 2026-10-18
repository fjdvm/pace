import { cn } from "@/lib/utils";
import { Citation } from "../shared/citation";

type ProblemCardProps = {
  number: string;
  title: string;
  description: string;
  citation: string;
  illustrationClassName: string;
  children: React.ReactNode;
};

export function ProblemCard({
  number,
  title,
  description,
  citation,
  illustrationClassName,
  children,
}: ProblemCardProps) {
  return (
    <article className="pace-card flex flex-col gap-4 rounded-[32px] px-4 pb-7 pt-4">
      <div
        className={cn(
          "relative h-[210px] overflow-hidden rounded-[24px]",
          illustrationClassName,
        )}
      >
        {children}
      </div>
      <div className="flex flex-col gap-2.5 px-3 pt-2">
        <p className="pace-eyebrow text-pace-muted">{number}</p>
        <h3 className="pace-h3 text-pace-ink">{title}</h3>
        <p className="pace-body text-pace-ink-2">{description}</p>
        <Citation>{citation}</Citation>
      </div>
    </article>
  );
}
