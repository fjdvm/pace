import { AnnouncementPage } from "@/components/features/announcement-page/page-content";

export default function Page({ params }: { params: Promise<{ id: string; postId: string }> }) {
  return <AnnouncementPage params={params} />;
}
