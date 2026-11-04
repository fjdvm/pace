"use client";

import { useAssignmentActions } from "@/components/features/dashboard/instructor/components/use-assignment-actions";
import { DeleteAssignmentDialog } from "@/components/features/submissions/delete-assignment-dialog";
import { ClassworkHeader } from "./classwork-header";
import { ClassworkList } from "./classwork-list";
import { ClassworkRowMenu } from "./classwork-row-menu";
import type { ClassworkItem } from "./types";

type InstructorClassworkProps = {
  classId: string;
  joinCode: string;
  archived: boolean;
  items: ClassworkItem[];
};

export function InstructorClasswork({ classId, joinCode, archived, items }: InstructorClassworkProps) {
  const { pendingDelete, isDeleting, requestDelete, cancelDelete, confirmDelete } = useAssignmentActions();

  return (
    <div className="w-full">
      <ClassworkHeader classId={classId} joinCode={joinCode} archived={archived} />
      <ClassworkList
        items={items}
        hrefFor={(item) => `/dashboard/submissions/${item.id}`}
        menuFor={(item) => <ClassworkRowMenu assignmentId={item.id} onDelete={() => requestDelete(item)} />}
      />
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
