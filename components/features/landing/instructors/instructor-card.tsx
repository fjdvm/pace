import { cn } from "@/lib/utils";

type InstructorCardProps = {
  title: string;
  description: string;
  illustrationClassName: string;
  children: React.ReactNode;
};

export function InstructorCard({
  title,
  description,
  illustrationClassName,
  children,
}: InstructorCardProps) {
  return (
    <article className="pace-card flex flex-col gap-5 rounded-[32px] px-4 pb-7 pt-4 transition-transform duration-300 hover:-translate-y-1">
      <div
        className={cn(
          "flex h-[200px] flex-col justify-center gap-2.5 overflow-hidden rounded-[24px] px-5",
          illustrationClassName,
        )}
      >
        {children}
      </div>
      <div className="flex flex-col gap-2.5 px-3">
        <h3 className="pace-h3 text-pace-ink">{title}</h3>
        <p className="pace-body text-pace-ink-2">{description}</p>
      </div>
    </article>
  );
}
