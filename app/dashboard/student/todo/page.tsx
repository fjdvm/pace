import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentClasses } from "@/lib/student-home-data";
import { StudentTodoView } from "@/components/features/student/todo/student-todo-view";

export default async function StudentTodoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const classes = await getStudentClasses(user.id);
  return <StudentTodoView classes={classes} />;
}
