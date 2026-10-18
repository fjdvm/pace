import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";

type PhaseCardProps = {
  phase: number;
  icon: string;
  iconClassName: string;
  title: string;
  description: string;
};

export function PhaseCard({ phase, icon, iconClassName, title, description }: PhaseCardProps) {
  return (
    <div className="pace-card flex flex-1 flex-col gap-3.5 rounded-[32px] px-7 pb-8 pt-7 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-[52px] items-center justify-center rounded-2xl",
            iconClassName,
          )}
        >
          <LandingIcon name={icon} size={24} />
        </div>
        <p className="pace-eyebrow text-pace-muted">Phase {phase}</p>
      </div>
      <h3 className="pace-h3 text-pace-ink">{title}</h3>
      <p className="pace-body text-pace-ink-2">{description}</p>
    </div>
  );
}
