import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { ProblemCard } from "./problem-card";
import { ToolFlowIllustration } from "./tool-flow-illustration";
import { AiAnswerIllustration } from "./ai-answer-illustration";
import { EndlessHelpIllustration } from "./endless-help-illustration";

export function ProblemSection() {
  return (
    <SectionShell id="problem" className="bg-pace-canvas">
      <SectionHeading
        eyebrow="The problem"
        eyebrowClassName="text-pace-red"
        title="Learning to code has a tool problem and an AI problem."
        description="What we saw in our own classes, and what the research says, point to three gaps."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          number="01"
          title="Too many tools for one assignment"
          description="Students write code in an IDE, paste it into a document, export a PDF, and upload it to the LMS. None of these tools were built to work together."
          citation="Birillo et al., 2024"
          illustrationClassName="bg-pace-peach"
        >
          <ToolFlowIllustration />
        </ProblemCard>
        <ProblemCard
          number="02"
          title="AI that hands out answers"
          description="General chatbots give complete solutions by default. Students can submit code that runs without understanding why it works."
          citation="Sun et al., 2024 · Zhai et al., 2024"
          illustrationClassName="bg-pace-sky"
        >
          <AiAnswerIllustration />
        </ProblemCard>
        <ProblemCard
          number="03"
          title="Help with no limits"
          description="When help is instant and unlimited, students tend to ask before they try. Knowing when to ask for help is a skill that takes practice."
          citation="Aleven et al., 2003 · Zimmerman, 2002"
          illustrationClassName="bg-pace-sun"
        >
          <EndlessHelpIllustration />
        </ProblemCard>
      </div>
    </SectionShell>
  );
}
