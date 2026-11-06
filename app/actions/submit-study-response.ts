"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/study/form-progress";
import { getQuestionnaireClosedAt } from "@/lib/study/questionnaire-status";
import { getOrCreateRespondent, submittedSittings } from "@/lib/study/respondent-store";
import { parseSubmission } from "@/lib/study/response";

export async function submitStudyResponse(role: string, sitting: number, state: FormState) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Sign in to submit your answers");
    if (await getQuestionnaireClosedAt()) throw new Error("The questionnaire is closed");

    if (role !== "student" && role !== "instructor") throw new Error("Choose student or instructor");
    const respondent = await getOrCreateRespondent(user.id, role);
    const parsed = parseSubmission({ role, sitting, state }, await submittedSittings(respondent.id));
    if (!parsed.ok) throw new Error(parsed.error);
    const { value } = parsed;

    await prisma.$transaction([
      prisma.studyResponse.create({
        data: {
          version: value.role,
          role: value.role,
          sitting: value.sitting,
          respondentId: respondent.id,
          profile: value.profile,
          answers: value.answers,
          comments: value.comments,
        },
      }),
      prisma.studyDraft.deleteMany({ where: { respondentId: respondent.id, sitting: value.sitting } }),
    ]);
    return { success: true };
  } catch (err) {
    console.error("Failed to save study response:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
