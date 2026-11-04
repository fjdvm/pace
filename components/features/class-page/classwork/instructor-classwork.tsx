"use client";

import { useAssignmentActions } from "@/components/features/dashboard/instructor/components/use-assignment-actions";
import { DeleteAssignmentDialog } from "@/components/features/submissions/delete-assignment-dialog";
import { ClassworkHeader } from "./classwork-header";
import { InstructorWorkList } from "./instructor-work-list";
import type { InstructorAssignment } from "../types";

type InstructorClassworkProps = {
  classId: string;
  joinCode: string;
  archived: boolean;
  items: InstructorAssignment[];
};

export function InstructorClasswork({ classId, joinCode, archived, items }: InstructorClassworkProps) {
  const { pendingDelete, isDeleting, requestDelete, cancelDelete, confirmDelete } = useAssignmentActions();

  return (
    <div className="w-full">
      <ClassworkHeader classId={classId} joinCode={joinCode} archived={archived} />
      <InstructorWorkList items={items} onDelete={requestDelete} />
      <DeleteAssignmentDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) cancelDelete();
        }}
        onConfirm={confirmDelete}
        assignmentTitle={pendingDelete?.title ?? ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}
