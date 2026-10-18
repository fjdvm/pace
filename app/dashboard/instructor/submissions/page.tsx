import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInstructorClasses } from "@/lib/instructor-classes";
import { getInstructorAssignmentRows } from "@/lib/instructor-assignment-rows";
import { SubmissionsListView } from "@/components/features/instructor/submissions/submissions-list-view";

export default async function InstructorSubmissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [classes, assignments] = await Promise.all([
    getInstructorClasses(user.id),
    getInstructorAssignmentRows(user.id),
  ]);

  return <SubmissionsListView classes={classes} assignments={assignments} />;
}
