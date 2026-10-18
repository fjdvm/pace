import { Fragment } from "react";
import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { PhaseArrow } from "./phase-arrow";
import { PhaseCard } from "./phase-card";
import { StackChips } from "./stack-chips";

const phases = [
  {
    icon: "icon-lightbulb-dark",
    iconClassName: "bg-pace-sun",
    title: "Inception",
    description:
      "AI turned our goals into requirements, user stories, and units of work. We reviewed them together in mob elaboration.",
  },
  {
    icon: "icon-code-dark",
    iconClassName: "bg-pace-lavender-tint",
    title: "Construction",
    description:
      "AI proposed the architecture, data models, code, and tests. We made the technical and design decisions.",
  },
  {
    icon: "icon-rocket",
    iconClassName: "bg-pace-mint",
    title: "Operations",
    description:
      "AI helped deploy and configure the services, with the team checking each step.",
  },
];

export function BuiltSection() {
  return (
    <SectionShell className="bg-pace-canvas">
      <SectionHeading
        eyebrow="How we built it"
        eyebrowClassName="text-pace-amber"
        title="Built in under a week with AI, reviewed by people."
        description="We followed the AI-Driven Development Life Cycle (Raja SP, 2025): AI proposes, the team decides, in short work cycles called bolts."
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {phases.map((phase, index) => (
          <Fragment key={phase.title}>
            {index > 0 && <PhaseArrow />}
            <PhaseCard phase={index + 1} {...phase} />
          </Fragment>
        ))}
      </div>
      <StackChips />
    </SectionShell>
  );
}
