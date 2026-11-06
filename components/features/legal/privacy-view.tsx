import { StudyPageLayout } from "@/components/features/study-pages/layout/study-page-layout";
import { Prose } from "@/components/features/study-pages/blocks/prose";
import { ItemList } from "@/components/features/study-pages/blocks/item-list";

const collected = [
  "Your Google account name and email address.",
  "Your classes, activities, code, test results, and submissions.",
  "Your messages to Spark.",
  "Activity events while you work: typing, pasting, switching tabs or windows, and code runs, with their times.",
  "Your questionnaire answers.",
];

const rights = [
  "To be informed about how your data is used.",
  "To withdraw from the study at any time without penalty.",
  "To ask the researchers about your data through the contact in your consent form.",
];

const sections = [
  { title: "What we collect", body: <ItemList items={collected} /> },
  {
    title: "Why we collect it",
    body: (
      <Prose>
        To run the platform during the evaluation and to answer the study&apos;s research questions. Participation is voluntary, and no monetary or academic incentive is offered.
      </Prose>
    ),
  },
  {
    title: "Who can see it",
    body: (
      <Prose>
        Your instructor sees your submissions, your messages to Spark, and your activity flags. The researchers see the data needed for analysis. No personally identifiable information appears in the reported findings.
      </Prose>
    ),
  },
  {
    title: "How it is stored",
    body: (
      <Prose>
        Data is stored in a database hosted on Supabase and sent over HTTPS. API keys for the AI providers are encrypted. Questions sent to Spark are processed by an external AI provider, so do not enter personal information in the chat.
      </Prose>
    ),
  },
  {
    title: "How long we keep it",
    body: (
      <Prose>
        Activity records, code, and chat messages from the evaluation are used only for the study and are deleted after the study is completed.
      </Prose>
    ),
  },
  { title: "Your rights", body: <ItemList items={rights} /> },
];

export function PrivacyView() {
  return (
    <StudyPageLayout
      eyebrow="Project"
      title="Privacy and data"
      intro="How PACE handles personal data during the study, in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173)."
      sections={sections}
    />
  );
}
