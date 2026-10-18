import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getStudentHomeData } from "@/lib/student-home-data";
import { StudentHomeView } from "@/components/features/student/home/student-home-view";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  });
  if (!dbUser) redirect("/login");

  const data = await getStudentHomeData({ id: user.id, ...dbUser });
  return <StudentHomeView data={data} />;
}
