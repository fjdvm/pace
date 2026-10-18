import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getSystemStatus } from "@/lib/system-status-data";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { ApiKeyManagementCard } from "@/components/features/admin-settings/api-key-management-card";
import { SystemStatusCard } from "@/components/features/admin/overview/system-status-card";

const API_KEY_SETTINGS = [
  { key: "GROQ_API_KEY", label: "Groq API Key" },
  { key: "GOOGLE_GENERATIVE_AI_API_KEY", label: "Google AI API Key" },
];

export default async function AdminSettingsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const [settings, system] = await Promise.all([
    prisma.systemSetting.findMany({ where: { key: { in: API_KEY_SETTINGS.map((k) => k.key) } } }),
    getSystemStatus(),
  ]);
  const settingsMap = new Map(settings.map((s) => [s.key, s]));

  const apiKeys = API_KEY_SETTINGS.map((item) => {
    const setting = settingsMap.get(item.key);
    return {
      key: item.key,
      label: item.label,
      hasValue: !!setting?.value,
      updatedAt: setting?.updatedAt?.toISOString() ?? null,
    };
  });

  return (
    <>
      <StudentTopBar title="Settings" subtitle="Provider keys and platform configuration" hideBell />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-6 p-4 md:px-10 md:py-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <ApiKeyManagementCard initialKeys={apiKeys} />
        <SystemStatusCard items={system.items} showManageKeys={false} />
      </main>
    </>
  );
}
