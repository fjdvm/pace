import { requireAdmin } from "@/lib/require-admin";
import { getStudyBundle } from "@/lib/study/study-data";
import { buildStudyWorkbook } from "@/lib/study/workbook";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return new Response("Forbidden", { status: 403 });
  }

  const { dataset, results } = await getStudyBundle();
  const file = await buildStudyWorkbook(dataset, results);
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="pace-study-results.xlsx"',
    },
  });
}
