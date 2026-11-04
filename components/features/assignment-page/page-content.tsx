import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadStudentAssignment } from "./load-student-assignment";
import { StudentAssignmentView } from "./student-assignment-view";

export async function StudentAssignmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await loadStudentAssignment(id, user.id);
  if (!data) redirect("/dashboard");

  return <StudentAssignmentView data={data} />;
}
