import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAssignmentOverview } from "@/lib/assignment-overview-data";
import { AssignmentOverviewView } from "@/components/features/instructor/submissions/assignment-overview-view";

type PageProps = { params: Promise<{ assignmentId: string }> };

export default async function AssignmentSubmissionsPage({ params }: PageProps) {
  const { assignmentId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const overview = await getAssignmentOverview(user.id, assignmentId);
  if (!overview) redirect("/dashboard/instructor/submissions");

  return <AssignmentOverviewView overview={overview} />;
}
