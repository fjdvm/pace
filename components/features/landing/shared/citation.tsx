import { LandingIcon } from "./landing-icon";

export function Citation({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 pt-1.5">
      <LandingIcon name="icon-book" size={14} />
      <span className="pace-small text-pace-muted">{children}</span>
    </div>
  );
}
