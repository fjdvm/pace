import { expect, it } from "vitest";
import { auth, db, submission } from "../../test/grading-fixture";
import { unsubmitSubmission } from "./unsubmit-submission";

it("restores every answer as a draft before removing the Turned in Submission", async () => {
  auth.userId = "student";
  await unsubmitSubmission("post");
  expect(db.codeDraft.upsert).toHaveBeenCalledTimes(2);
  expect(db.codeDraft.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      create: {
        studentId: "student",
        assignmentId: "post",
        itemId: "two",
        code: "print(2)",
      },
    }),
  );
  expect(db.submissionRevision.create).toHaveBeenCalledWith({
    data: {
      id: "submission",
      studentId: "student",
      assignmentId: "post",
      snapshot: JSON.parse(JSON.stringify(submission)),
    },
  });
  expect(db.submissionRevision.create.mock.invocationCallOrder[0]).toBeLessThan(
    db.submission.delete.mock.invocationCallOrder[0],
  );
  expect(db.submission.delete).toHaveBeenCalledWith({
    where: { id: "submission" },
  });
  expect(db.codeDraft.upsert.mock.invocationCallOrder[1]).toBeLessThan(
    db.submission.delete.mock.invocationCallOrder[0],
  );
});
it("refuses to unsubmit a Graded or Returned Submission", async () => {
  auth.userId = "student";
  for (const status of ["graded", "returned"]) {
    db.submission.findUnique.mockResolvedValue({ ...submission, status });
    await expect(unsubmitSubmission("post")).rejects.toThrow("Turned in");
  }
  expect(db.codeDraft.upsert).not.toHaveBeenCalled();
  expect(db.submission.delete).not.toHaveBeenCalled();
});
it("rejects signed-out Users, the Instructor and unenrolled Users", async () => {
  auth.userId = null;
  await expect(unsubmitSubmission("post")).rejects.toThrow("Unauthorized");
  auth.userId = "instructor";
  await expect(unsubmitSubmission("post")).rejects.toThrow("Student");
  auth.userId = "outsider";
  db.enrollment.findFirst.mockResolvedValue(null);
  await expect(unsubmitSubmission("post")).rejects.toThrow("Student");
  expect(db.submission.delete).not.toHaveBeenCalled();
});
