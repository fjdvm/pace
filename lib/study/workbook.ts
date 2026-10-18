import ExcelJS from "exceljs";
import { CONSTRUCTS, THEMES } from "./questionnaire";
import type { StudyResults } from "./analysis";
import type { StudyDataset } from "./dataset";

const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export async function buildStudyWorkbook(dataset: StudyDataset, results: StudyResults) {
  const workbook = new ExcelJS.Workbook();

  const about = workbook.addWorksheet("About");
  about.addRow(["PACE acceptability evaluation"]);
  about.addRow(["Sample data: generated for demonstration. These are not real respondents."]);

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
  respondents.addRow(["Respondent", "Role", "Submitted", ...CONSTRUCTS.flatMap((c) => c.items.map((_, i) => `${c.id}${i + 1}`))]);
  for (const r of dataset.respondents) {
    respondents.addRow([r.id, r.role, r.submittedAt, ...CONSTRUCTS.flatMap((c) => r.answers[c.id])]);
  }

  const comments = workbook.addWorksheet("Comments");
  comments.addRow(["Respondent", "Role", "Theme", "Comment"]);
  for (const c of dataset.comments) {
    comments.addRow([c.respondentId, c.role, THEMES.find((t) => t.id === c.themeId)?.label ?? c.themeId, c.text]);
  }

  for (const sheet of workbook.worksheets) sheet.getRow(1).font = { bold: true };
  return Buffer.from(await workbook.xlsx.writeBuffer());
}
