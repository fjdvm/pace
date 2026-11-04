import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardClasses } from "@/lib/dashboard-classes";
import { ArchivedClassesView } from "./archived-classes-view";

export async function ArchivedClasses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <ArchivedClassesView {...await getDashboardClasses(user.id)} />;
}
