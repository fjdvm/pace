import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCompareData } from "@/lib/submission-detail-data";
import { CompareView } from "@/components/features/instructor/submissions/detail/compare-view";

type PageProps = {
  params: Promise<{ assignmentId: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
};

export default async function CompareSubmissionsPage({ params, searchParams }: PageProps) {
  const { assignmentId } = await params;
  const { a, b } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = a && b ? await getCompareData(user.id, assignmentId, a, b) : null;
  if (!data) redirect(`/dashboard/instructor/submissions/${assignmentId}`);

  return <CompareView data={data} />;
}
