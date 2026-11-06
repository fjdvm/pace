import { SparkFlyIn } from "./spark-fly-in";
import { AudienceToggle } from "./audience-toggle";

export function MeetSparkSection() {
  return (
    <section
      id="meet-spark"
      className="flex flex-col items-center gap-9 bg-lp-canvas pt-16 sm:pt-[100px]"
    >
      <SparkFlyIn />
      <h2 className="max-w-[358px] text-center font-lp-serif text-[32px] font-medium leading-9 tracking-[-0.384px] text-lp-ink sm:max-w-none sm:text-[48px] sm:leading-normal sm:tracking-[-0.576px]">
        Meet Spark, the pair programmer in PACE
      </h2>
      <AudienceToggle />
    </section>
  );
}
