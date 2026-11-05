import { expect, it } from "vitest";
import { mocks } from "../../test/tutor-fixture";
import { startAssignment } from "./start-assignment";
it("creates and regenerates hearts for the authenticated Student and selected Item", async () => {
  expect((await startAssignment("post", "two")).success).toBe(true);
  expect(mocks.hearts.upsert).toHaveBeenCalledWith(expect.objectContaining({
    where: { studentId_itemId: { studentId: "student", itemId: "two" } },
    create: { studentId: "student", assignmentId: "post", itemId: "two", currentCount: 5 },
  }));
});
it("rejects a foreign Item, outsider, Instructor and unauthenticated User", async () => {
  expect((await startAssignment("post", "foreign")).success).toBe(false);
  mocks.access.mockRejectedValueOnce(new Error("Only an enrolled Student can work on this Post"));
  expect((await startAssignment("post", "two")).success).toBe(false);
  mocks.user.mockResolvedValueOnce({ data: { user: null } });
  expect((await startAssignment("post", "two")).success).toBe(false);
  expect(mocks.hearts.upsert).not.toHaveBeenCalled();
});
