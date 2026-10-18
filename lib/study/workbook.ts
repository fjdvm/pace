import ExcelJS from "exceljs";
import { COMMENT_PROMPTS, CONSTRUCTS } from "./questionnaire";
import type { StudyResults } from "./analysis";
import type { StudyDataset } from "./dataset";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export async function buildStudyWorkbook(dataset: StudyDataset, results: StudyResults) {
  const workbook = new ExcelJS.Workbook();

  const about = workbook.addWorksheet("About");
  about.addRow(["PACE acceptability evaluation"]);
  about.addRow(["Anonymous responses collected through the PACE questionnaire. No names or accounts are stored."]);

  const summary = workbook.addWorksheet("Constructs");
  summary.addRow(["Construct", "Students mean", "Students SD", "Students interpretation", "Instructors mean", "Instructors SD", "Instructors interpretation"]);
  for (const c of results.constructs) {
    summary.addRow([`${c.id} · ${c.name}`, round(c.student.mean), round(c.student.sd), c.student.label, round(c.instructor.mean), round(c.instructor.sd), c.instructor.label]);
  }

  const items = workbook.addWorksheet("Items");
  items.addRow(["Construct", "Item", "Students mean", "Students SD", "Instructors mean", "Instructors SD"]);
  for (const i of results.items) {
    items.addRow([i.constructId, i.text, round(i.student.mean), round(i.student.sd), round(i.instructor.mean), round(i.instructor.sd)]);
  }

  const comparison = workbook.addWorksheet("Students vs instructors");
  comparison.addRow(["Construct", "Median students", "Median instructors", "U", "p", "Effect r", "Result"]);
  for (const c of results.comparison) {
    comparison.addRow([c.id, c.studentMedian, c.instructorMedian, c.u, round(c.p, 3), round(c.r), c.result]);
  }

  const respondents = workbook.addWorksheet("Respondents");
  respondents.addRow(["Respondent", "Role", "Submitted", "Year level", "Courses taken", "AI tool use", ...CONSTRUCTS.flatMap((c) => c.items.map((_, i) => `${c.id}${i + 1}`))]);
  for (const r of dataset.respondents) {
    respondents.addRow([r.id, r.role, r.submittedAt, r.profile?.yearLevel ?? "", r.profile?.coursesTaken ?? "", r.profile?.aiUsage ?? "", ...CONSTRUCTS.flatMap((c) => r.answers[c.id])]);
  }

  const comments = workbook.addWorksheet("Comments");
  comments.addRow(["Respondent", "Role", "Prompt", "Theme", "Comment"]);
  for (const c of dataset.comments) {
    comments.addRow([c.respondentId, c.role, COMMENT_PROMPTS.find((p) => p.id === c.promptId)?.label ?? c.promptId, c.themeIds.map((id) => dataset.themes.find((t) => t.id === id)?.label ?? id).join("; "), c.text]);
  }

  for (const sheet of workbook.worksheets) sheet.getRow(1).font = { bold: true };
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
