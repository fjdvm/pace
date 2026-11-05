import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { AiImportView } from "@/components/features/instructor/ai-import/ai-import-view";

type PageProps = { searchParams: Promise<{ classId?: string }> };

export async function AiImportPage({ searchParams }: PageProps) {
  const { classId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  if (!classId) redirect("/dashboard");
  const cls = await prisma.class.findFirst({
    where: { id: classId, instructorId: user.id },
    select: { id: true, name: true },
  });
  if (!cls) redirect("/dashboard");
  return <AiImportView classId={cls.id} className={cls.name} />;
}
