import { SectionHeading } from "../shared/section-heading";
import { ApproachCard } from "./approach-card";
import { HeartRow } from "./heart-row";
import { LanguageChips } from "./language-chips";

export function ApproachSection() {
  return (
    <section id="approach" className="scroll-mt-24 bg-white px-6 pb-10 pt-20 lg:pt-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-14 rounded-[32px] bg-pace-night px-6 pb-12 pt-14 sm:rounded-[54px] lg:px-[72px] lg:pb-[72px] lg:pt-20">
        <SectionHeading
          tone="dark"
          eyebrow="Our approach"
          eyebrowClassName="text-pace-green"
          title="One place to code, and a tutor that knows when to hold back."
          description="PACE answers each problem with one design decision."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <ApproachCard
            icon="icon-layers"
            iconClassName="bg-pace-green"
            badge="Answers problem 01"
            title="One workspace"
            description="Read the assignment, write code, run tests in a sandbox, and submit, all in the browser. Scores come from the share of test cases passed."
          >
            <LanguageChips />
          </ApproachCard>
          <ApproachCard
            icon="icon-sparkles-dark"
            iconClassName="bg-pace-lavender"
            badge="Answers problem 02"
            title="A tutor that guides, not solves"
            description="It reads your code and latest test results, then does four things only: explain code, hint at errors, clarify concepts, and guide problem-solving. It declines requests for full solutions."
          />
          <ApproachCard
            icon="heart-red-large"
            iconClassName="bg-pace-cream"
            badge="Answers problem 03"
            title="Hearts make each question count"
            description="Each assignment gives you 5 hearts. A question costs one, and one comes back every 30 minutes. Instructors can change both."
          >
            <HeartRow />
          </ApproachCard>
        </div>
      </div>
    </section>
  );
}
