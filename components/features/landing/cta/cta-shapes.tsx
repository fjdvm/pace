import { LandingIcon } from "../shared/landing-icon";

export function CtaShapes() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[520px] lg:block" aria-hidden>
      <LandingIcon
        name="cta-circle-large"
        size={300}
        className="absolute left-[188px] top-[-60px] animate-pace-float"
      />
      <div className="absolute left-[258px] top-[194px] size-[170px] animate-pace-sway rounded-[36px] bg-pace-amber" />
      <span className="absolute left-[62px] top-[170px] size-[150px] animate-pace-beat">
        <LandingIcon name="cta-heart" size={150} className="rotate-[10deg]" />
      </span>
      <LandingIcon
        name="cta-ring"
        size={120}
        className="absolute left-[408px] top-[150px] animate-pace-spin-slow"
      />
    </div>
  );
}
