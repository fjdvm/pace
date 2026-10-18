import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubmissionDetail } from "@/lib/submission-detail-data";
import { SubmissionDetailView } from "@/components/features/instructor/submissions/detail/submission-detail-view";

type PageProps = { params: Promise<{ assignmentId: string; studentId: string }> };

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { assignmentId, studentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const detail = await getSubmissionDetail(user.id, assignmentId, studentId);
  if (!detail) redirect("/dashboard/instructor/submissions");

  return <SubmissionDetailView detail={detail} />;
}
