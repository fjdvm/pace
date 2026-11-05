import { getSubmissionHistory } from "@/lib/submission-history";
import { SubmissionHistoryView } from "@/components/features/submission-review/components/submission-history-view";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubmissionDetail } from "@/lib/submission-detail-data";
import { SubmissionReviewView } from "@/components/features/submission-review/submission-review-view";
import { getSubmissionReview } from "@/lib/submission-review-data";

type PageProps = { params: Promise<{ assignmentId: string; studentId: string }> };

export async function SubmissionDetailPage({ params }: PageProps) {
  const { assignmentId, studentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const detail = await getSubmissionDetail(user.id, assignmentId, studentId);
  if (!detail) redirect("/dashboard/submissions");

  const review = await getSubmissionReview(assignmentId, studentId, user.id);
  const history = await getSubmissionHistory(assignmentId, studentId, user.id);
  if (!review) return <main className="p-6"><p className="mb-4">No current Submission.</p><SubmissionHistoryView history={history} detail={detail} /></main>;
  return <SubmissionReviewView detail={detail} review={review} history={history} />;
}
