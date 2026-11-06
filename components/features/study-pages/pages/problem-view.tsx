import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { ItemList } from "../blocks/item-list";
import { DataTable } from "../blocks/data-table";

const questions = [
  {
    lead: "What problems do students and instructors encounter in the current workflow in terms of:",
    lines: [
      "– completing and submitting programming assignments across separate tools;",
      "– using AI tools for help with programming tasks; and",
      "– monitoring how students produce their submitted code?",
    ],
  },
  "To what extent does PACE, through its regulated AI tutor, hearts mechanic, test cases, and activity monitoring, address these problems, as perceived by students and instructors?",
  {
    lead: "What is the level of acceptability of the current workflow and of PACE in terms of:",
    lines: ["– Perceived Usefulness;", "– Perceived Ease of Use;", "– Attitude Toward Use; and", "– Behavioral Intention to Use?"],
  },
  {
    lead: "Is there a significant difference between the current workflow and PACE in terms of:",
    lines: ["– the extent of the problems identified; and", "– the four acceptability constructs?"],
  },
  "What improvements can be identified from the evaluation results to enhance PACE for future development?",
];

const treatments = [
  ["1", "Part II, current workflow column", "Weighted mean"],
  ["2", "Part II, PACE column, and the PACE feature items", "Weighted mean"],
  ["3", "Part III, both columns", "Weighted mean"],
  ["4", "Parts II and III, paired ratings", "Wilcoxon signed-rank test"],
  ["5", "Part IV, open-ended comments", "Coded into themes"],
];

const sections = [
  { title: "Research questions", body: <ItemList ordered items={questions} /> },
  { title: "How each question is answered", body: <DataTable narrowFirst headers={["Question", "Source", "Treatment"]} rows={treatments} /> },
  {
    title: "Scope",
    body: (
      <Prose>
        The study covers the development of PACE and its evaluation against the current workflow. Core features (the regulated AI tutor, the hearts mechanic, the code editor and execution engine, and the assignment module) are the focus; supporting features such as gamification and the class stream are included but are not research variables.
      </Prose>
    ),
  },
];

export function ProblemView() {
  return (
    <StudyPageLayout
      eyebrow="The study"
      title="Statement of the problem"
      intro="This study aims to address the fragmented tools, unguided use of AI, and limited instructor visibility in programming courses by developing PACE and comparing it with the current workflow of a learning management system, a separate IDE, and general-purpose AI tools."
      sections={sections}
    />
  );
}
