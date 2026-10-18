import { HeroAxis } from "./hero-axis";
import { HeroHeadline } from "./hero-headline";
import { HintLevels } from "./hint-levels";
import { HeartsRefill } from "./hearts-refill";
import { CodeBlocks } from "./code-blocks";
import { CooldownWave } from "./cooldown-wave";

export function HeroArt() {
  return (
    <div className="relative my-4 w-full min-[1100px]:my-0 min-[1100px]:-mb-[105px] min-[1100px]:h-[420px] min-[1100px]:w-[1440px] min-[1100px]:max-w-none min-[1100px]:origin-top min-[1100px]:scale-[0.75] min-[1280px]:-mb-[50px] min-[1280px]:scale-[0.88] min-[1440px]:mb-0 min-[1440px]:scale-100">
      <div className="hidden min-[1100px]:block" aria-hidden>
        <HeroAxis top={168} />
        <HeroAxis top={358} />
        <HintLevels />
        <HeartsRefill />
        <CodeBlocks />
        <CooldownWave />
      </div>
      <HeroHeadline />
    </div>
  );
}
