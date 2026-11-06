import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { ItemList } from "../blocks/item-list";

const steps = [
  "Sign in with your school Google account and choose Student.",
  "Join your class with the class code from your instructor.",
  "Open an activity from the class stream or your to-do list.",
];

const recorded = [
  "Typing, pasting (with the number of characters), switching tabs or windows, and code runs, each with its time.",
  "Your code, test results, and messages to Spark.",
  "These are shown only to your instructor, as flags that prompt a closer look. They are not used to judge you, and they are deleted after the study.",
];

const sections = [
  { title: "Getting started", body: <ItemList ordered items={steps} /> },
  {
    title: "Doing an activity",
    body: (
      <Prose>
        An activity can have several items, such as coding problems and multiple-choice questions. For a coding item, write your code in the editor and run it against the visible test cases. When you turn in, all test cases run, including hidden ones, and your score is the percentage of tests passed.
      </Prose>
    ),
  },
  {
    title: "Getting help from Spark",
    body: (
      <Prose>
        Spark explains code, traces output, points to where an error likely is, and clarifies concepts. It does not give complete solutions or corrected code. Each question costs one heart; hearts refill over time, and the hints become more specific as you spend more hearts.
      </Prose>
    ),
  },
  { title: "What is recorded", body: <ItemList items={recorded} /> },
];

export function StudentsView() {
  return (
    <StudyPageLayout
      eyebrow="Platform"
      title="For students"
      intro="What students do in PACE during the evaluation sessions, and what is recorded while they work."
      sections={sections}
    />
  );
}
