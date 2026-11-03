import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { ProblemCard } from "./problem-card";
import { ToolFlowIllustration } from "./tool-flow-illustration";
import { AiAnswerIllustration } from "./ai-answer-illustration";
import { HiddenProcessIllustration } from "./hidden-process-illustration";

export function ProblemSection() {
  return (
    <SectionShell id="problem" className="bg-pace-canvas">
      <SectionHeading
        eyebrow="The problem"
        eyebrowClassName="text-pace-red"
        title="Today’s workflow: separate tools, unguided AI, and code no one saw being written."
        description="Most programming classes still run on an LMS, a separate IDE, and general AI chatbots. What we saw in our own classes, and what the research says, point to three problems."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          number="01"
          title="Too many tools for one assignment"
          description="Students write code in an IDE, paste it into a document, export a PDF, and upload it to the LMS. Instructors get files they can’t run and check each program by hand."
          citation="Birillo et al., 2024 · Paiva et al., 2022"
          illustrationClassName="bg-pace-peach"
        >
          <ToolFlowIllustration />
        </ProblemCard>
        <ProblemCard
          number="02"
          title="AI that hands out answers"
          description="General chatbots give complete solutions by default, with no limit on how often students ask. Students can submit code that runs without understanding why it works."
          citation="Sun et al., 2024 · Zhai et al., 2024 · Prather et al., 2024"
          illustrationClassName="bg-pace-sky"
        >
          <AiAnswerIllustration />
        </ProblemCard>
        <ProblemCard
          number="03"
          title="No view of how the code was made"
          description="Instructors only see the finished file. They can’t tell whether it was typed, pasted from somewhere else, or copied from an AI tool open in another tab."
          citation="Lau & Guo, 2023 · Sağlam et al., 2024"
          illustrationClassName="bg-pace-sun"
        >
          <HiddenProcessIllustration />
        </ProblemCard>
      </div>
    </SectionShell>
  );
}
