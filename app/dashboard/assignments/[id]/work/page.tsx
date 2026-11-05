import { AssignmentWorkspacePage } from "@/components/features/student/workspace/page-content";

export default function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ item?: string }> }) {
  return <AssignmentWorkspacePage params={params} searchParams={searchParams} />;
}
