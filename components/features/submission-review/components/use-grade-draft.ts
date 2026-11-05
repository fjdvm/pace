"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveSubmissionGrade,
  deleteSubmissionGrade,
} from "@/app/actions/grade-submission";
import { returnSubmissions } from "@/app/actions/return-submissions";
import type { SubmissionReview } from "@/lib/submission-review-data";

export function useGradeDraft(review: SubmissionReview, postId: string) {
  const [grades, setGrades] = useState<
    import("@/lib/submission-state").ItemGrade[]
  >(review.items.map((i) => ({ itemId: i.id, grade: i.grade ?? i.autoGrade })));
  const [finalGrade, setFinalGrade] = useState(
    review.finalGrade?.toString() ?? "",
  );
  const [feedback, setFeedback] = useState(review.feedback);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();
  const total = review.items.reduce((sum, i) => sum + i.points, 0);
  const sum = grades.reduce((sum, i) => sum + (i.grade ?? 0), 0);
  const returned = review.status === "returned";
  function act(mode: "save" | "return" | "delete") {
    setError("");
    start(async () => {
      try {
        if (mode === "delete")
          await deleteSubmissionGrade(postId, review.submissionId);
        else {
          await saveSubmissionGrade(
            postId,
            review.submissionId,
            grades,
            finalGrade === "" ? null : Number(finalGrade),
            feedback,
          );
          if (mode === "return")
            await returnSubmissions(postId, [review.submissionId]);
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save grade");
      }
    });
  }
  return {
    grades,
    setGrades,
    finalGrade,
    setFinalGrade,
    feedback,
    setFeedback,
    error,
    pending,
    returned,
    total,
    sum,
    act,
  };
}
