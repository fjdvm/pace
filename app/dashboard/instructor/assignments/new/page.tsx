import { NewAssignmentPage } from "@/components/features/instructor/pages/new-assignment-page";

export default function Page(props: Parameters<typeof NewAssignmentPage>[0]) {
  return <NewAssignmentPage {...props} />;
}
