import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getInstructorHomeData } from "@/lib/instructor-home-data";
import { InstructorHomeView } from "@/components/features/instructor/home/instructor-home-view";

export default async function InstructorDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true, email: true } });
  if (!dbUser) redirect("/login");

  const data = await getInstructorHomeData({ id: user.id, ...dbUser });
  return <InstructorHomeView data={data} />;
}
