import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClassPageView } from "@/components/features/class-page/class-page-view";
import { loadClassPageData } from "./load-class-page-data";

export async function ClassPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const data = await loadClassPageData(id, user.id);
  if (!data) redirect("/dashboard");
  return <ClassPageView data={data} />;
}
