import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { getAdminOverview } from "@/lib/admin-overview-data";
import { AdminOverviewView } from "@/components/features/admin/overview/admin-overview-view";

export default async function AdminDashboardPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }
  const data = await getAdminOverview();
  return <AdminOverviewView data={data} />;
}
