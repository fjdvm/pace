import { PaceButton } from "@/components/features/student/shared/pace-button";

export function NewAssignmentButton() {
  return (
    <PaceButton href="/dashboard/instructor/assignments/new" variant="primary">
      New assignment
    </PaceButton>
  );
}
