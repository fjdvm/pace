import { cn } from "@/lib/utils";

type StudyCardProps = {
  title: string;
  subtitle?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function StudyCard({ title, subtitle, aside, className, children }: StudyCardProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px] font-bold text-pace-ink">{title}</h2>
          {subtitle && <p className="text-xs text-pace-ink-2">{subtitle}</p>}
        </div>
        {aside}
      </header>
      {children}
    </section>
  );
}
