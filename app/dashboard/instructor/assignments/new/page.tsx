import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getInstructorClasses } from "@/lib/instructor-classes";
import { AssignmentFormView } from "@/components/features/instructor/assignment-form/assignment-form-view";

type PageProps = { searchParams: Promise<{ classId?: string }> };

export default async function NewAssignmentPage({ searchParams }: PageProps) {
  const { classId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const classes = await getInstructorClasses(user.id);
  return <AssignmentFormView classes={classes} defaultClassId={classes.find((c) => c.id === classId)?.id} />;
}
