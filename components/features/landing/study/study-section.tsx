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
        title="Current workflow vs. PACE, rated by the same people."
        description="First- and second-year BSIT students and programming instructors rate their current workflow first. Then they use PACE and rate it on the same items, adapted from the Technology Acceptance Model (Davis, 1989). We compare each person’s two ratings with the Wilcoxon signed-rank test."
      />
      <div className="flex flex-col gap-6 lg:flex-row">
        <TamPanel />
        <ClaimsPanel />
      </div>
      <StudyStats />
    </SectionShell>
  );
}
