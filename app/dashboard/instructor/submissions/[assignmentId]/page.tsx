import { AssignmentSubmissionsPage } from "@/components/features/instructor/pages/assignment-submissions-page";

export default function Page(props: Parameters<typeof AssignmentSubmissionsPage>[0]) {
  return <AssignmentSubmissionsPage {...props} />;
}
