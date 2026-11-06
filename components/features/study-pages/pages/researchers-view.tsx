import { StudyPageLayout } from "../layout/study-page-layout";
import { Prose } from "../blocks/prose";
import { PeopleCards, type Person } from "../blocks/people-cards";

const people: Person[] = [
  { name: "Fitzjaymar Jude D. Martin", initials: "FM", color: "#22c55e", role: "Researcher" },
  { name: "Jhoyce Anne Niel B. Dumlao", initials: "JD", color: "#8b5cf6", role: "Researcher" },
  { name: "Christopher M. Gabayno", initials: "CG", color: "#3b82f6", role: "Researcher" },
];

const sections = [
  { title: "The team", body: <PeopleCards people={people} /> },
  {
    title: "Contact",
    body: (
      <Prose>
        For questions about the study or your participation, contact the researchers through your instructor or at the email address on your informed consent form.
      </Prose>
    ),
  },
];

export function ResearchersView() {
  return (
    <StudyPageLayout
      eyebrow="Project"
      title="Researchers"
      intro="PACE: Development and Acceptability Evaluation of a Regulated AI Tutoring Platform for Programming Education. An undergraduate research of the Polytechnic University of the Philippines, 2026."
      sections={sections}
    />
  );
}
