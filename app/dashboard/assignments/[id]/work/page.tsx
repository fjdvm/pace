import { AssignmentWorkspacePage } from "@/components/features/student/workspace/page-content";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <AssignmentWorkspacePage params={params} />;
}
