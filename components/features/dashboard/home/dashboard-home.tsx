import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardClasses } from "@/lib/dashboard-classes";
import { DashboardHomeView } from "./dashboard-home-view";

export async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <DashboardHomeView {...await getDashboardClasses(user.id)} />;
}
