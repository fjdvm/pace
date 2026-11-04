import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAssignmentOverview } from "@/lib/assignment-overview-data";
import { StudentWorkView } from "@/components/features/student-work-page/student-work-view";

type PageProps = { params: Promise<{ assignmentId: string }> };

export async function AssignmentSubmissionsPage({ params }: PageProps) {
  const { assignmentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const overview = await getAssignmentOverview(user.id, assignmentId);
  if (!overview) redirect("/dashboard/submissions");

  return <StudentWorkView overview={overview} />;
}
