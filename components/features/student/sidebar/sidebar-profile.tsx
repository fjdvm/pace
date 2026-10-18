import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";

export type SidebarXp = {
  level: number;
  currentXp: number;
  nextThreshold: number;
};

type SidebarProfileProps = {
  name: string;
  roleLabel?: string;
  tone?: "green" | "purple" | "blue";
  xp?: SidebarXp;
  collapsed: boolean;
};

export function SidebarProfile({ name, roleLabel = "Student", tone, xp, collapsed }: SidebarProfileProps) {
  if (collapsed) {
    return <InitialsAvatar name={name} tone={tone} className="size-9" />;
  }
  return (
    <div className="flex w-full flex-col gap-2.5 rounded-2xl bg-pace-canvas p-3.5">
      <div className="flex items-center gap-2.5">
        <InitialsAvatar name={name} tone={tone} className="size-9" />
        <div className="flex min-w-0 flex-col gap-0.5 text-[13px] leading-normal">
          <span className="truncate font-semibold text-pace-ink">{name}</span>
          <span className="truncate text-pace-muted">{roleLabel}</span>
        </div>
      </div>
      {xp && (
        <>
          <div className="flex items-center justify-between text-[13px] leading-normal">
            <span className="font-semibold text-pace-ink">Level {xp.level}</span>
            <span className="text-pace-muted">
              {xp.currentXp} / {xp.nextThreshold} XP
            </span>
          </div>
          <ProgressBar
            tone="amber"
            value={(xp.currentXp / Math.max(xp.nextThreshold, 1)) * 100}
            className="h-1.5"
          />
        </>
      )}
    </div>
  );
}
