import { cn } from "@/lib/utils";
import { Citation } from "../shared/citation";

type FeatureRowProps = {
  number: number;
  title: string;
  description: string;
  citation: string;
  reverse?: boolean;
  children: React.ReactNode;
};

export function FeatureRow({
  number,
  title,
  description,
  citation,
  reverse,
  children,
}: FeatureRowProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-10 lg:gap-20",
        reverse ? "lg:flex-row-reverse" : "lg:flex-row",
      )}
    >
      <div className="flex w-full flex-col items-start gap-4 lg:w-[460px] lg:shrink-0">
        <span className="pace-body flex size-10 items-center justify-center rounded-xl bg-pace-ink font-semibold leading-[1.2] text-white">
          {number}
        </span>
        <h3 className="pace-h3 text-pace-ink">{title}</h3>
        <p className="pace-body-l text-pace-ink-2">{description}</p>
        <Citation>{citation}</Citation>
      </div>
      {children}
    </div>
  );
}
