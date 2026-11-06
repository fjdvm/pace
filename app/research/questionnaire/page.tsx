import type { Metadata } from "next";
import { QuestionnairePage } from "@/components/features/research/questionnaire/questionnaire-page";

export const metadata: Metadata = { title: "Evaluation questionnaire · PACE" };
export const dynamic = "force-dynamic";

export default function Questionnaire() {
  return <QuestionnairePage />;
}
