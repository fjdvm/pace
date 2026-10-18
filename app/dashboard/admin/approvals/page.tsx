import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { getPendingInstructors, getReviewedInstructors } from "@/lib/admin-overview-data";
import { ApprovalsView } from "@/components/features/admin/approvals/approvals-view";

export default async function AdminApprovalsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }
  const [pending, reviewed] = await Promise.all([getPendingInstructors(), getReviewedInstructors()]);
  return <ApprovalsView pending={pending} reviewed={reviewed} />;
}
