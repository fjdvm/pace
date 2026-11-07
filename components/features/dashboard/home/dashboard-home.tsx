import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getDashboardClasses } from "@/lib/dashboard-classes";
import { getTeachingHome } from "@/app/actions/teaching-home";
import { HOME_VIEW_COOKIE } from "@/lib/home-view";
import { DashboardHomeView } from "./dashboard-home-view";

export async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const savedView = (await cookies()).get(HOME_VIEW_COOKIE)?.value;
  const [classes, teachingHome] = await Promise.all([getDashboardClasses(user.id), getTeachingHome()]);
  return <DashboardHomeView {...classes} teachingHome={teachingHome} savedView={savedView} />;
}
