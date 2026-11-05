import { expect, it } from "vitest";
import { auth, db } from "../../test/workspace-fixture";
import { saveDraft } from "./save-draft";
import { readWorkspaceDraft, deleteWorkspaceDraft } from "./workspace-draft";
it("creates and updates only the Student's selected Item draft, including empty code", async () => {
  expect((await saveDraft("post", "", "one")).success).toBe(true);
  expect(db.codeDraft.upsert).toHaveBeenCalledWith(expect.objectContaining({
    where: { studentId_itemId: { studentId: "student", itemId: "one" } }, update: { code: "" },
    create: { assignmentId: "post", studentId: "student", itemId: "one", code: "" },
  }));
});
it("reads and deletes only a Student's own draft", async () => {
  db.codeDraft.findUnique.mockResolvedValue({ code: "draft" });
  expect(await readWorkspaceDraft("post", "one")).toEqual({ code: "draft" });
  await deleteWorkspaceDraft("post", "one");
  expect(db.codeDraft.deleteMany).toHaveBeenCalledWith({ where: { studentId: "student", assignmentId: "post", itemId: "one" } });
});
it("rejects unauthenticated Users, Instructors, outsiders, Draft Posts and foreign Items", async () => {
  auth.userId = null; expect((await saveDraft("post", "code", "one")).success).toBe(false);
  auth.userId = "instructor"; await expect(readWorkspaceDraft("post", "one")).rejects.toThrow("Student");
  auth.userId = "outsider"; db.enrollment.findFirst.mockResolvedValue(null);
  await expect(deleteWorkspaceDraft("post", "one")).rejects.toThrow("Student");
  auth.userId = "student"; db.enrollment.findFirst.mockResolvedValue({});
  expect((await saveDraft("post", "code", "foreign")).success).toBe(false);
  db.assignment.findUnique.mockResolvedValue(null); expect((await saveDraft("post", "code", "one")).success).toBe(false);
  expect(db.codeDraft.upsert).not.toHaveBeenCalled();
});
it("prevents changing drafts after turn-in", async () => {
  db.submission.findUnique.mockResolvedValue({ id: "submitted" });
  expect((await saveDraft("post", "code", "one")).success).toBe(false);
  await expect(deleteWorkspaceDraft("post", "one")).rejects.toThrow("turned in");
  expect(db.codeDraft.deleteMany).not.toHaveBeenCalled();
});
