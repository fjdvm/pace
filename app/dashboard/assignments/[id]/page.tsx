import { StudentAssignmentPage } from "@/components/features/assignment-page/page-content";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <StudentAssignmentPage params={params} />;
}
