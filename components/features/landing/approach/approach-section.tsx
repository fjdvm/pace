import { SectionHeading } from "../shared/section-heading";
import { ApproachCard } from "./approach-card";
import { HeartRow } from "./heart-row";
import { LanguageChips } from "./language-chips";
import { ActivityLevels } from "./activity-levels";

export function ApproachSection() {
  return (
    <section id="approach" className="scroll-mt-24 bg-white px-6 pb-10 pt-20 lg:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-14 rounded-[32px] bg-pace-night px-6 pb-12 pt-14 sm:rounded-[54px] lg:px-[72px] lg:pb-[72px] lg:pt-20">
        <SectionHeading
          tone="dark"
          eyebrow="Our approach"
          eyebrowClassName="text-pace-green"
          title="One place to code, a tutor that holds back, and a view of the process."
          description="PACE answers each problem with one design decision."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <ApproachCard
            icon="icon-layers"
            iconClassName="bg-pace-green"
            badge="Answers problem 01"
            title="One workspace"
            description="Read the activity, write code, run tests in a sandbox, and submit, all in the browser. Scores come from the share of test cases passed, so instructors never check files by hand."
          >
            <LanguageChips />
          </ApproachCard>
          <ApproachCard
            icon="icon-sparkles-dark"
            iconClassName="bg-pace-lavender"
            badge="Answers problem 02"
            title="A tutor that guides, with limits"
            description="It reads your code and latest test results, then only explains, hints, clarifies, and guides. It declines requests for full solutions, and each question costs one of 5 hearts."
          >
            <HeartRow />
          </ApproachCard>
          <ApproachCard
            icon="icon-search-purple"
            iconClassName="bg-pace-cream"
            badge="Answers problem 03"
            title="Instructors see the process"
            description="While students work, PACE records typing, pasting, tab switches, and runs, then sums them up as an activity level. Students are told about it before they start."
          >
            <ActivityLevels />
          </ApproachCard>
        </div>
      </div>
    </section>
  );
}
