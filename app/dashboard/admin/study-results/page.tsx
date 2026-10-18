import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { getStudyBundle } from "@/lib/study/study-data";
import { StudyResultsView } from "@/components/features/admin/study/study-results-view";

export default async function StudyResultsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const { dataset, results, closedAt, isSample } = await getStudyBundle();
  return (
    <StudyResultsView
      data={{
        results,
        closedAt,
        isSample,
        respondents: dataset.respondents.map(({ id, role, submittedAt }) => ({ id, role, submittedAt })),
        comments: dataset.comments.map(({ respondentId, role, themeId, text }) => ({ respondentId, role, themeId, text })),
      }}
    />
  );
}
