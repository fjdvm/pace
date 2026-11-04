import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getStudentClasses } from "@/lib/student-home-data";
import { TodoView } from "./todo-view";

export async function TodoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const classes = (await getStudentClasses(user.id)).filter((c) => !c.archived);
  return <TodoView classes={classes} />;
}
