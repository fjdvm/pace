import { SectionHeading } from "../shared/section-heading";
import { SectionShell } from "../shared/section-shell";
import { FeatureRow } from "./feature-row";
import { HintStaircaseVisual } from "./hint-staircase-visual";
import { OutOfHeartsVisual } from "./out-of-hearts-visual";
import { TutorHelpVisual } from "./tutor-help-visual";

export function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works" className="bg-white" innerClassName="gap-24">
      <SectionHeading
        eyebrow="How it works"
        eyebrowClassName="text-pace-purple"
        title="Help that stops short of the answer."
        description="The tutor lives next to the editor, so it can see your code and your latest test results. Here is what it does, and what it won’t."
      />
      <FeatureRow
        number={1}
        title="Four kinds of help, nothing more"
        description="Ask the tutor to explain your code, point to where an error likely is, clarify a concept, or suggest your next step. Ask it for the full answer and it declines, then offers a hint instead."
        citation="Design based on CS50 Duck (Liu et al., 2024)"
      >
        <TutorHelpVisual />
      </FeatureRow>
      <FeatureRow
        number={2}
        reverse
        title="Hints get more specific as you spend hearts"
        description="Your first question gets a conceptual nudge. Each heart you spend moves the tutor one level closer to the details, up to near-pseudocode at level 5. You get only as much help as you need."
        citation="Scaffolding (Wood, Bruner & Ross, 1976)"
      >
        <HintStaircaseVisual />
      </FeatureRow>
      <FeatureRow
        number={3}
        title="Out of hearts? You can still work."
        description="Writing code and running tests never cost hearts. While you wait for the next heart, PACE suggests what to try on your own, so the pause becomes time to think it through."
        citation="Hearts throttling adapted from CS50 (Liu et al., 2024)"
      >
        <OutOfHeartsVisual />
      </FeatureRow>
    </SectionShell>
  );
}
