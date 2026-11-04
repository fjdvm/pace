import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { InstructorClassDetailPage } from "./instructor-class-page";
import { StudentClassDetailPage } from "./student-class-page";

export async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const cls = await prisma.class.findUnique({ where: { id }, select: { instructorId: true } });
  if (!cls) redirect("/dashboard");
  return cls.instructorId === user.id
    ? <InstructorClassDetailPage params={params} />
    : <StudentClassDetailPage params={params} />;
}
