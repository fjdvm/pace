import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  eyebrowClassName: string;
  title: string;
  description: string;
  tone?: "light" | "dark";
};

export function SectionHeading({
  eyebrow,
  eyebrowClassName,
  title,
  description,
  tone = "light",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col items-start gap-[18px]">
      <p className={cn("pace-eyebrow", eyebrowClassName)}>{eyebrow}</p>
      <h2
        className={cn(
          "pace-h2 max-w-[880px]",
          dark ? "text-pace-cream" : "text-pace-ink",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "pace-body-l max-w-[720px]",
          dark ? "text-pace-cream/75" : "text-pace-ink-2",
        )}
      >
        {description}
      </p>
    </div>
  );
}
