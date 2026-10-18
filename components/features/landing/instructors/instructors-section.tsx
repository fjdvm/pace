import { LandingIcon } from "../shared/landing-icon";
import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { FlagsIllustration } from "./flags-illustration";
import { HeartsIllustration } from "./hearts-illustration";
import { InstructorCard } from "./instructor-card";
import { TestsIllustration } from "./tests-illustration";

export function InstructorsSection() {
  return (
    <SectionShell id="instructors" className="bg-pace-canvas">
      <SectionHeading
        eyebrow="For instructors"
        eyebrowClassName="text-pace-blue"
        title="Instructors set the rules."
        description="Teachers create the assignments, decide how much help students get, and review the results in one place."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InstructorCard
          title="Assignments with hidden tests"
          description="Write the instructions, add visible tests for practice and hidden tests for grading, and set a due date. Scores are computed automatically."
          illustrationClassName="bg-pace-sky"
        >
          <TestsIllustration />
        </InstructorCard>
        <InstructorCard
          title="You decide how much help"
          description="Set the number of hearts per student and how long each one takes to come back. The defaults are 5 hearts and 30 minutes."
          illustrationClassName="bg-pace-peach"
        >
          <HeartsIllustration />
        </InstructorCard>
        <InstructorCard
          title="Flags, not verdicts"
          description="PACE flags very similar submissions and unusual activity, such as large pastes. A flag means “take a look,” not proof of copying."
          illustrationClassName="bg-pace-sun"
        >
          <FlagsIllustration />
        </InstructorCard>
      </div>
      <div className="flex items-center gap-3.5 rounded-[20px] border-[1.5px] border-dashed border-pace-line px-6 py-[18px]">
        <LandingIcon name="icon-trophy" size={20} />
        <p className="pace-body text-pace-ink-2">
          Also in PACE: XP, levels, badges, streaks, and a class leaderboard. They
          keep practice fun, but they are supporting features and not part of what
          we evaluate.
        </p>
      </div>
    </SectionShell>
  );
}
