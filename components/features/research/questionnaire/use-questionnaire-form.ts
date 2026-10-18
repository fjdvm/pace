import { useState } from "react";
import { toast } from "sonner";
import { submitStudyResponse } from "@/app/actions/submit-study-response";
import {
  aboutYouComplete,
  countAnswered,
  emptyAnswers,
  stepStates,
  TOTAL_STATEMENTS,
  type AboutYou,
  type RatingAnswers,
} from "@/lib/study/form-progress";
import type { CommentPromptId, ConstructId, QuestionnaireVersion } from "@/lib/study/questionnaire";
import { useSubmittedSummary } from "./use-submitted-summary";

const emptyComments = (): Record<CommentPromptId, string> => ({ helpful: "", problems: "", improve: "" });

export function useQuestionnaireForm() {
  const [version, setVersion] = useState<QuestionnaireVersion>("student");
  const [about, setAbout] = useState<AboutYou>({ yearLevel: "", coursesTaken: "", aiUsage: "" });
  const [answers, setAnswers] = useState<RatingAnswers>(emptyAnswers);
  const [comments, setComments] = useState(emptyComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { summary, remember } = useSubmittedSummary();

  const answered = countAnswered(answers);
  const aboutDone = aboutYouComplete(version, about);
  const ready = aboutDone && answered === TOTAL_STATEMENTS;

  const answer = (construct: ConstructId, itemIndex: number, rating: number) =>
    setAnswers((prev) => ({ ...prev, [construct]: prev[construct].map((v, i) => (i === itemIndex ? rating : v)) }));

  const submit = async () => {
    if (!ready) return;
    setIsSubmitting(true);
    const result = await submitStudyResponse({
      version,
      yearLevel: about.yearLevel,
      coursesTaken: about.coursesTaken,
      aiUsage: about.aiUsage,
      answers: answers as Record<ConstructId, number[]>,
      comments,
    });
    setIsSubmitting(false);
    if (!result.success) {
      toast.error(result.error || "Could not save your answers");
      return;
    }
    remember({ version, ratings: TOTAL_STATEMENTS, comments: Object.values(comments).filter((c) => c.trim()).length });
  };

  return {
    version,
    setVersion,
    about,
    patchAbout: (patch: Partial<AboutYou>) => setAbout((prev) => ({ ...prev, ...patch })),
    answers,
    answer,
    comments,
    setComment: (id: CommentPromptId, value: string) => setComments((prev) => ({ ...prev, [id]: value })),
    answered,
    steps: stepStates(aboutDone, answered, TOTAL_STATEMENTS),
    ready,
    isSubmitting,
    submit,
    summary,
  };
}
