import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";

type ToolTileProps = {
  icon: string;
  label: string;
  left: number;
  top: number;
  active: boolean;
  delay: string;
};

export function ToolTile({ icon, label, left, top, active, delay }: ToolTileProps) {
  return (
    <div
      className="absolute animate-pace-bob"
      style={{ left, top, animationDelay: delay }}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 rounded-xl border-[1.5px] border-pace-line bg-white px-3 py-[9px] shadow-[0_3px_0_0_#e8c9be] transition-all duration-500",
          active ? "scale-100 opacity-100" : "scale-90 opacity-30",
        )}
      >
        <LandingIcon name={icon} size={15} />
        <span className="pace-small font-semibold text-pace-ink">{label}</span>
      </div>
    </div>
  );
}
