"use client";

import { ArchiveRestore, LogOut, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClassMembershipActions } from "../use-class-membership-actions";
import { ConfirmAction } from "./confirm-action";

type ClassActionsProps = {
  cls: { id: string; name: string; archived: boolean };
  role: "instructor" | "student";
};

export function ClassActions({ cls, role }: ClassActionsProps) {
  const { handleArchiveToggle, handleLeave, handleDelete } = useClassMembershipActions();

  if (role === "student") {
    return (
      <ConfirmAction
        label="Leave"
        icon={LogOut}
        title={`Leave "${cls.name}"?`}
        description="You'll need the join code to enroll again."
        onConfirm={() => handleLeave(cls)}
      />
    );
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => handleArchiveToggle(cls)}>
        <ArchiveRestore /> Restore
      </Button>
      <ConfirmAction
        label="Delete"
        icon={Trash2}
        title={`Delete "${cls.name}"?`}
        description="This permanently removes the class and its student enrollments. This cannot be undone."
        onConfirm={() => handleDelete(cls)}
      />
    </div>
  );
}
