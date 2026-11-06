import { LandingNav } from "@/components/features/landing/nav/landing-nav";
import { createClient } from "@/lib/supabase/server";
import { getQuestionnaireClosedAt } from "@/lib/study/questionnaire-status";
import { getQuestionnaireProgress } from "@/lib/study/respondent-store";
import { QuestionnaireView } from "./questionnaire-view";

const emptyProgress = {
  student: { submitted: [], drafts: {} },
  instructor: { submitted: [], drafts: {} },
};

export async function QuestionnairePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [closedAt, progress] = await Promise.all([
    getQuestionnaireClosedAt(),
    user ? getQuestionnaireProgress(user.id) : emptyProgress,
  ]);
  return <QuestionnaireView closed={!!closedAt} signedIn={!!user} progress={progress} nav={<LandingNav />} />;
}
