import { expect, it } from "vitest";
import { auth, db, submission } from "../../test/grading-fixture";
import { returnSubmissions } from "./return-submissions";

it("returns one or many Graded Submissions atomically", async () => {
  await returnSubmissions("post", ["submission"]);
  expect(db.submission.updateMany).toHaveBeenCalledWith({
    where: {
      id: { in: ["submission"] },
      assignmentId: "post",
      status: "graded",
    },
    data: { status: "returned", returnedAt: expect.any(Date) },
  });
  db.submission.findMany.mockResolvedValue([
    { ...submission, status: "graded", finalGrade: 50 },
    { ...submission, id: "second", status: "graded", finalGrade: 50 },
  ]);
  await returnSubmissions("post", ["submission", "second"]);
  expect(db.submission.updateMany).toHaveBeenCalledTimes(2);
});
it("rejects an ungraded Short answer even when a final grade exists", async () => {
  db.submission.findMany.mockResolvedValue([
    {
      ...submission,
      status: "graded",
      finalGrade: 50,
      assignment: { items: [{ id: "one", kind: "short_answer", points: 50 }] },
      answers: [{ itemId: "one", grade: null }],
    },
  ]);
  await expect(returnSubmissions("post", ["submission"])).rejects.toThrow(
    "Short answer",
  );
  expect(db.submission.updateMany).not.toHaveBeenCalled();
});
it("validates the whole batch before writing and refuses foreign Submissions", async () => {
  db.submission.findMany.mockResolvedValue([
    { ...submission, status: "graded", finalGrade: 50 },
    submission,
  ]);
  await expect(
    returnSubmissions("post", ["submission", "second"]),
  ).rejects.toThrow("draft grade");
  db.submission.findMany.mockResolvedValue([]);
  await expect(returnSubmissions("post", ["foreign"])).rejects.toThrow(
    "not found",
  );
  expect(db.submission.updateMany).not.toHaveBeenCalled();
});
it("requires the Class's Instructor", async () => {
  for (const userId of [null, "student", "other-instructor"]) {
    auth.userId = userId;
    await expect(returnSubmissions("post", ["submission"])).rejects.toThrow(
      "Instructor",
    );
  }
  expect(db.submission.updateMany).not.toHaveBeenCalled();
});

it("allows an explicitly zeroed Short answer to be Returned", async () => {
  db.submission.findMany.mockResolvedValue([{ ...submission, status: "graded", finalGrade: 0,
    assignment: { items: [{ id: "one", kind: "short_answer", points: 50 }] },
    answers: [{ itemId: "one", grade: 0, score: null }],
  }]);
  await expect(returnSubmissions("post", ["submission"])).resolves.toEqual({ success: true });
});
