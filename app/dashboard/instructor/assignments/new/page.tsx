import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInstructorClasses } from "@/lib/instructor-classes";
import { AssignmentFormView } from "@/components/features/instructor/assignment-form/assignment-form-view";

export default async function NewAssignmentPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const classes = await getInstructorClasses(user.id);
  return <AssignmentFormView classes={classes} />;
}
