import { LandingIcon } from "../shared/landing-icon";
import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { FlagsIllustration } from "./flags-illustration";
import { InstructorCard } from "./instructor-card";
import { ItemsIllustration } from "./items-illustration";
import { ImportIllustration } from "./import-illustration";

export function InstructorsSection() {
  return (
    <SectionShell id="instructors" className="bg-pace-canvas">
      <SectionHeading
        eyebrow="For instructors"
        eyebrowClassName="text-pace-blue"
        title="Instructors set the rules and see the process."
        description="Teachers build the activities, decide how much help students get (5 hearts and 30 minutes per heart by default), and review the results in one place."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <InstructorCard
          title="Activities with several items"
          description="Mix coding, multiple-choice, and short-answer items in one activity. Coding items get visible tests for practice and hidden tests for grading, scored automatically."
          illustrationClassName="bg-pace-sky"
          tag="In development"
        >
          <ItemsIllustration />
        </InstructorCard>
        <InstructorCard
          title="Write items, or import a file"
          description="Add items yourself, or upload a PDF, Word file, or photo of your activity sheet. The AI reads it, splits it into items, and drafts test cases. Nothing is posted until you check it."
          illustrationClassName="bg-pace-lavender-tint"
          tag="In development"
        >
          <ImportIllustration />
        </InstructorCard>
        <InstructorCard
          title="Flags, not verdicts"
          description="Each submission shows its activity level and timeline, and PACE flags very similar submissions. A flag means “take a look,” not proof of copying."
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
