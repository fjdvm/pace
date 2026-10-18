import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { ClaimsPanel } from "./claims-panel";
import { StudyStats } from "./study-stats";
import { TamPanel } from "./tam-panel";

export function StudySection() {
  return (
    <SectionShell id="study" className="bg-white">
      <SectionHeading
        eyebrow="The study"
        eyebrowClassName="text-pace-green-deep"
        title="What we’re measuring, and what we’re not."
        description="Students and instructors use PACE, then rate it on a 5-point scale adapted from the Technology Acceptance Model (Davis, 1989). We compare the two groups with the Mann-Whitney U test."
      />
      <div className="flex flex-col gap-6 lg:flex-row">
        <TamPanel />
        <ClaimsPanel />
      </div>
      <StudyStats />
    </SectionShell>
  );
}
