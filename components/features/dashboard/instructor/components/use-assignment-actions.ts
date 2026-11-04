"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteAssignment } from "@/app/actions/delete-assignment";

interface AssignmentToDelete {
  id: string;
  title: string;
}

export function useAssignmentActions() {
  const router = useRouter();
  const [pendingDelete, setPendingDelete] = useState<AssignmentToDelete | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const requestDelete = (assignment: AssignmentToDelete) => {
    setPendingDelete(assignment);
  };

  const cancelDelete = () => {
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    const result = await deleteAssignment(pendingDelete.id);
    if (result.success) {
      toast.success("Post deleted");
      setPendingDelete(null);
      router.refresh();
      setIsDeleting(false);
      return true;
    } else {
      toast.error(result.error || "Failed to delete Post");
    }
    setIsDeleting(false);
    return false;
  };

  return { pendingDelete, isDeleting, requestDelete, cancelDelete, confirmDelete };
}
