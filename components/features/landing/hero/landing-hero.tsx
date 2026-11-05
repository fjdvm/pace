import { HeroHeadline } from "./hero-headline";
import { HeroSubhead } from "./hero-subhead";
import { HeroActions } from "./hero-actions";
import { HeroCardFan } from "./fan/hero-card-fan";

export function LandingHero() {
  return (
    <section className="flex flex-col items-center gap-6 overflow-hidden bg-lp-canvas px-4 pb-16 pt-24 text-center sm:px-6 sm:pb-0 sm:pt-[142px]">
      <HeroHeadline />
      <HeroSubhead />
      <HeroActions />
      <div className="-mx-4 w-[calc(100%+2rem)] max-sm:order-first sm:-mx-6 sm:mt-6 sm:w-[calc(100%+3rem)]">
        <HeroCardFan />
      </div>
    </section>
  );
}
