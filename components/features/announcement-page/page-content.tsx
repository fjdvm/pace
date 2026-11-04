import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadClassPageData } from "@/components/features/dashboard/home/load-class-page-data";
import { AnnouncementView } from "./announcement-view";

export async function AnnouncementPage({ params }: { params: Promise<{ id: string; postId: string }> }) {
  const { id, postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const data = await loadClassPageData(id, user.id);
  const post = data?.posts.find((p) => p.id === postId);
  if (!data || !post) redirect(`/dashboard/classes/${id}`);

  return <AnnouncementView data={data} post={post} />;
}
