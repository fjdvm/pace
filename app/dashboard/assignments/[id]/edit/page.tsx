import { EditAssignmentPage } from "@/components/features/instructor/pages/edit-assignment-page";

export default function Page(props: Parameters<typeof EditAssignmentPage>[0]) {
  return <EditAssignmentPage {...props} />;
}
