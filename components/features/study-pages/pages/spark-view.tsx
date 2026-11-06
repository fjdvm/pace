import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { InfoCards } from "../blocks/info-cards";
import { DataTable } from "../blocks/data-table";
import { Callout } from "../blocks/callout";

const abilities = [
  {
    title: "Spark will",
    lines: ["• Explain code", "• Trace its output", "• Point to where an error likely is", "• Clarify concepts", "• Guide problem-solving"],
  },
  {
    title: "Spark won't",
    lines: ["• Write complete solutions", "• Give corrected code", "• Answer after the activity is turned in (the chat becomes read-only)"],
  },
];

const levels = [
  ["1", "1", "A conceptual nudge"],
  ["2", "2", "Where to look"],
  ["3", "3", "An approach to try"],
  ["4", "4", "An outline of the steps"],
  ["5", "5", "Near-pseudocode logic"],
];

const sections = [
  { title: "What Spark does", body: <InfoCards cards={abilities} /> },
  { title: "Hint levels", body: <DataTable narrowFirst headers={["Level", "Hearts spent", "How specific"]} rows={levels} /> },
  {
    title: "Hearts",
    body: (
      <Prose>
        Each question costs one heart. Hearts refill one at a time after the period set by the instructor. The design draws on self-regulated learning: students plan, try the problem, and read their test results before asking.
      </Prose>
    ),
  },
  {
    title: "Your data",
    body: <Callout>Questions sent to Spark are processed by an external AI provider. Do not enter personal information in the chat.</Callout>,
  },
];

export function SparkView() {
  return (
    <StudyPageLayout
      eyebrow="Platform"
      title="Spark"
      intro="Spark is the regulated AI pair programmer in PACE. It sees the activity, the student's current code, and the latest test results, and it is limited by the hearts mechanic."
      sections={sections}
    />
  );
}
