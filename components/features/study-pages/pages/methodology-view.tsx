import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { ItemList } from "../blocks/item-list";
import { DataTable } from "../blocks/data-table";
import { Callout } from "../blocks/callout";

const phases = [
  { lead: "Inception", lines: ["– Objectives, scope, and requirements are defined from the problems identified in Chapter 1."] },
  { lead: "Construction", lines: ["– Work proceeds in short bolts; the team reviews each change and checks it with automated tests."] },
  { lead: "Operations", lines: ["– The platform is deployed, and issues found in testing feed back into new bolts."] },
];

const gathering = [
  "Permission is secured from the university and the college, and respondents receive an informed consent form and an orientation.",
  "Before using PACE, respondents answer Part I and the current workflow column of Parts II and III.",
  "Each respondent uses PACE in one to three sessions to complete sample tasks.",
  "After the sessions, respondents answer the PACE column, the PACE feature items, and the open-ended questions. Each sitting takes about 10 to 15 minutes.",
];

const treatments = [
  ["Frequency and percentage", "Respondent profile (Part I)"],
  ["Weighted mean", "Problem ratings and acceptability (Parts II and III)"],
  ["Wilcoxon signed-rank test", "Difference between the current workflow and PACE"],
];

const sections = [
  {
    title: "Research design",
    body: (
      <Prose>
        The developmental component covers the design, development, and testing of PACE. The descriptive-comparative component compares the two sets of ratings from the same respondents.
      </Prose>
    ),
  },
  {
    title: "Development",
    body: (
      <>
        <Prose>
          PACE is developed following the AI-Driven Development Life Cycle. AI coding assistants propose requirements, designs, code, and tests, and the research team reviews, corrects, and approves every output before it is kept.
        </Prose>
        <ItemList ordered items={phases} />
      </>
    ),
  },
  {
    title: "Respondents and sampling",
    body: (
      <Prose>
        Student respondents are first- and second-year students in the Information Technology program, selected by stratified random sampling with the sample size computed using Slovin&apos;s formula (e = 0.05) and allocated by year level. Instructor respondents are all eligible instructors who handle programming courses.
      </Prose>
    ),
  },
  { title: "Data gathering", body: <ItemList ordered items={gathering} /> },
  {
    title: "Statistical treatment",
    body: (
      <>
        <DataTable headers={["Treatment", "Used for"]} rows={treatments} />
        <Callout>Responses are encoded in a spreadsheet, checked for missing or invalid answers, and analyzed with JASP.</Callout>
      </>
    ),
  },
];

export function MethodologyView() {
  return (
    <StudyPageLayout
      eyebrow="The study"
      title="Methodology"
      intro="The study uses a developmental research design combined with a descriptive-comparative method. The same respondents rate the current workflow and PACE with one questionnaire, before and after a hands-on evaluation."
      sections={sections}
    />
  );
}
