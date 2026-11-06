import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { ItemList } from "../blocks/item-list";
import { Callout } from "../blocks/callout";

const creating = [
  "Create a class and share its join code.",
  "Write an activity with one or more items: coding problems with visible and hidden test cases, or multiple-choice questions.",
  "Choose the programming language: Python, C, JavaScript, or C#.",
  "Set the number of hearts (default 5) and how long each heart takes to refill (default 30 minutes).",
  "Importing an activity from a PDF or a photo is in development and is not part of the evaluation.",
];

const sections = [
  {
    title: "Getting started",
    body: (
      <Prose>
        Sign in with your school Google account and choose Instructor. An administrator approves instructor accounts before they can create classes, to keep student data safe.
      </Prose>
    ),
  },
  { title: "Creating activities", body: <ItemList items={creating} /> },
  {
    title: "Reviewing submissions",
    body: (
      <>
        <Prose>
          For each submission you can see the code, the test results, the student&apos;s messages with Spark, and an activity flag (Low, Medium, or High) with a timeline of the recorded events. A short AI-written summary suggests one next step.
        </Prose>
        <Callout>
          Activity flags prompt a closer look. They are not evidence of academic dishonesty on their own, and their accuracy is not validated in this study.
        </Callout>
      </>
    ),
  },
];

export function InstructorsView() {
  return (
    <StudyPageLayout
      eyebrow="Platform"
      title="For instructors"
      intro="What instructors do in PACE during the evaluation sessions."
      sections={sections}
    />
  );
}
