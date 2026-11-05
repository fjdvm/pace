import { expect, it } from "vitest";
import { auth, db, submission } from "../../test/grading-fixture";
import { saveSubmissionGrade, deleteSubmissionGrade } from "./grade-submission";

it("creates and updates a draft grade with per-Item adjustments and private feedback", async () => {
  const grades = [
    { itemId: "one", grade: 25 },
    { itemId: "two", grade: 40 },
  ];
  await saveSubmissionGrade("post", "submission", grades, null, " Feedback ");
  expect(db.submission.update).toHaveBeenCalledWith({
    where: { id: "submission" },
    data: { status: "graded", finalGrade: 65, feedback: "Feedback" },
  });
  expect(db.submissionAnswer.update).toHaveBeenCalledTimes(2);
  await saveSubmissionGrade("post", "submission", grades, 60, "Revised");
  expect(db.submission.update).toHaveBeenLastCalledWith({
    where: { id: "submission" },
    data: { status: "graded", finalGrade: 60, feedback: "Revised" },
  });
});
it("rejects signed-out Users, Students and another Class's Instructor", async () => {
  for (const userId of [null, "student", "outsider"]) {
    auth.userId = userId;
    await expect(
      saveSubmissionGrade("post", "submission", [], null, ""),
    ).rejects.toThrow("Instructor");
    await expect(deleteSubmissionGrade("post", "submission")).rejects.toThrow(
      "Instructor",
    );
  }
  expect(db.submission.update).not.toHaveBeenCalled();
});
it("rejects a foreign Submission and invalid or non-finite grades", async () => {
  db.submission.findUnique.mockResolvedValueOnce(null);
  await expect(
    saveSubmissionGrade("post", "foreign", [], null, ""),
  ).rejects.toThrow();
  for (const grade of [-1, 51, NaN, Infinity])
    await expect(
      saveSubmissionGrade(
        "post",
        "submission",
        [{ itemId: "one", grade }],
        null,
        "",
      ),
    ).rejects.toThrow();
  expect(db.submission.update).not.toHaveBeenCalled();
});
it("deletes only a draft grade while retaining the Submission and its answers", async () => {
  db.submission.findUnique.mockResolvedValue({
    ...submission,
    status: "graded",
  });
  await deleteSubmissionGrade("post", "submission");
  expect(db.submission.update).toHaveBeenCalledWith({
    where: { id: "submission" },
    data: { status: "turned_in", finalGrade: null, feedback: null },
  });
  expect(db.submissionAnswer.updateMany).toHaveBeenCalledWith({
    where: { submissionId: "submission" },
    data: { grade: null },
  });
  db.submission.findUnique.mockResolvedValue({
    ...submission,
    status: "returned",
  });
  await expect(deleteSubmissionGrade("post", "submission")).rejects.toThrow();
  await expect(
    saveSubmissionGrade("post", "submission", [], null, ""),
  ).rejects.toThrow();
});

it("keeps a partial Short answer draft's final grade blank until all Items are graded", async () => {
  db.submission.findUnique.mockResolvedValue({ ...submission,
    assignment: { items: [{ id: "one", kind: "short_answer", points: 50 }, { id: "two", kind: "coding", points: 50 }] },
  });
  await saveSubmissionGrade("post", "submission", [{ itemId: "one", grade: null }, { itemId: "two", grade: 20 }], null, "Draft feedback");
  expect(db.submission.update).toHaveBeenCalledWith({ where: { id: "submission" }, data: { status: "graded", finalGrade: null, feedback: "Draft feedback" } });
});
