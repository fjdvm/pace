import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";

type ApproachCardProps = {
  icon: string;
  iconClassName: string;
  badge: string;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function ApproachCard({
  icon,
  iconClassName,
  badge,
  title,
  description,
  children,
}: ApproachCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] bg-pace-night-2 px-7 pb-8 pt-7 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-14 items-center justify-center rounded-[18px]",
            iconClassName,
          )}
        >
          <LandingIcon name={icon} size={26} />
        </div>
        <span className="pace-small rounded-full bg-pace-night px-3 py-1.5 font-semibold text-pace-cream">
          {badge}
        </span>
      </div>
      <h3 className="pace-h3 text-pace-cream">{title}</h3>
      <p className="pace-body text-pace-cream/75">{description}</p>
      {children}
    </div>
  );
}
