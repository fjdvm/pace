import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/features/dashboard/dashboard-shell";
import { computeLevel, getTotalXp } from "@/lib/gamification";
import { getDashboardClasses } from "@/lib/dashboard-classes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { email: true, name: true, isAdmin: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const [classes, totalXp] = await Promise.all([getDashboardClasses(user.id), getTotalXp(user.id)]);
  const studentXp = computeLevel(totalXp);

  return (
    <DashboardShell isAdmin={dbUser.isAdmin} userEmail={dbUser.email} userName={dbUser.name} teaching={classes.teaching} enrolled={classes.enrolled} studentXp={studentXp}>
      {children}
    </DashboardShell>
  );
}
