import { ResearchChip } from "./research-chip";
import { HeroArt } from "./hero-art";
import { HeroActions } from "./hero-actions";

export function LandingHero() {
  return (
    <section className="flex flex-col items-center overflow-hidden bg-pace-canvas px-6 pb-20 pt-36 text-center lg:pb-[120px] lg:pt-[148px]">
      <ResearchChip />
      <HeroArt />
      <p className="pace-body-l max-w-[720px] pt-6 text-[22px] text-pace-ink">
        A coding workspace with an AI tutor that guides you, not solves it for you.
      </p>
      <HeroActions />
    </section>
  );
}
