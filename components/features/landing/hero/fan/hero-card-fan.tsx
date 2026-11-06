import { FanSlot } from "./fan-slot";
import { CodeCard } from "./cards/code-card";
import { TestsCard } from "./cards/tests-card";
import { SparkCard } from "./cards/spark-card";
import { HeartsCard } from "./cards/hearts-card";
import { QuizCard } from "./cards/quiz-card";
import { TimelineCard } from "./cards/timeline-card";
import { ActivityCard } from "./cards/activity-card";

const cards = [CodeCard, TestsCard, SparkCard, HeartsCard, QuizCard, TimelineCard, ActivityCard];

export function HeroCardFan() {
  return (
    <div
      data-hero-fan
      className="relative h-[232px] w-full overflow-hidden sm:h-[460px]"
    >
      <div className="absolute left-1/2 top-0 h-full w-[358px] -translate-x-1/2 [perspective:1600px] max-sm:animate-pace-fan-drift sm:w-[1440px]">
        {cards.map((Card, i) => (
          <FanSlot key={i} index={i} fade={i < cards.length - 1}>
            <Card />
          </FanSlot>
        ))}
      </div>
    </div>
  );
}
