import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { approveInstructor } from "@/app/actions/approve-instructor";
import { declineInstructor } from "@/app/actions/decline-instructor";

export function useInstructorReview() {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  const review = async (id: string, decision: "approve" | "decline") => {
    setBusyId(id);
    const result = decision === "approve" ? await approveInstructor(id) : await declineInstructor(id);
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error || "Could not update the request");
      return;
    }
    toast.success(decision === "approve" ? "Instructor approved" : "Request declined");
    router.refresh();
  };

  return { busyId, approve: (id: string) => review(id, "approve"), decline: (id: string) => review(id, "decline") };
}
