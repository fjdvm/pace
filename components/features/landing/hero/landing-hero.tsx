import { HeroHeadline } from "./hero-headline";
import { HeroSubhead } from "./hero-subhead";
import { HeroActions } from "./hero-actions";

export function LandingHero() {
  return (
    <section className="flex flex-col items-center gap-6 overflow-hidden bg-lp-canvas px-4 pb-16 pt-32 text-center sm:px-6 sm:pb-20 sm:pt-[142px]">
      <HeroHeadline />
      <HeroSubhead />
      <HeroActions />
    </section>
  );
}
