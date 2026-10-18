import type { Metadata } from "next";
import { getQuestionnaireClosedAt } from "@/lib/study/questionnaire-status";
import { QuestionnaireView } from "@/components/features/research/questionnaire/questionnaire-view";

export const metadata: Metadata = { title: "Evaluation questionnaire · PACE" };
export const dynamic = "force-dynamic";

export default async function QuestionnairePage() {
  return <QuestionnaireView closed={!!(await getQuestionnaireClosedAt())} />;
}
