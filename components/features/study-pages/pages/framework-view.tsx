import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { InfoCards } from "../blocks/info-cards";

const flow = [
  {
    title: "Input",
    lines: [
      "• Problems in the current workflow: separate tools, unguided AI use, limited view of how code is made",
      "• Literature on guided AI help, hearts systems, and activity monitoring",
      "• System requirements",
      "• TAM and Self-Regulated Learning",
    ],
  },
  {
    title: "Process",
    lines: [
      "• Development of PACE through the AI-Driven Development Life Cycle: Inception, Construction, Operations",
      "• Comparative evaluation: rate the current workflow, use PACE in 1–3 sessions, rate PACE on the same items",
      "• Analysis with the weighted mean and the Wilcoxon signed-rank test",
    ],
  },
  {
    title: "Output",
    lines: [
      "• The PACE platform",
      "• Extent of the problems and acceptability of each setup",
      "• Comparison of the two setups",
      "• Recommendations that feed back into the next development cycle",
    ],
  },
];

const theories = [
  {
    title: "Technology Acceptance Model",
    lines: ["The framework used to evaluate and compare the two setups. Its constructs are not tied to one system, so both can be rated on the same items."],
  },
  {
    title: "Self-Regulated Learning",
    lines: ["The design rationale for the hearts mechanic. Each question costs a heart, so students plan, try the problem, and read their test results before asking. It is not measured as a variable."],
  },
];

const sections = [
  { title: "Input, process, output", body: <InfoCards cards={flow} /> },
  {
    title: "Evaluation model",
    body: (
      <Prose>
        The current workflow and PACE are rated on the same problem items and the same four TAM constructs. Following Davis et al. (1989), perceived ease of use influences perceived usefulness; both shape attitude toward use; and attitude toward use and perceived usefulness lead to behavioral intention to use.
      </Prose>
    ),
  },
  { title: "Theories", body: <InfoCards cards={theories} /> },
];

export function FrameworkView() {
  return (
    <StudyPageLayout
      eyebrow="The study"
      title="Conceptual framework"
      intro="The framework combines the Input-Process-Output model, which shows how the study moves from the identified problems to an evaluated platform, with the Technology Acceptance Model, which defines how the current workflow and PACE are compared."
      sections={sections}
    />
  );
}
