import { expect, it } from "vitest";
import { db, values } from "../../test/coding-post-fixture";

it("updates the selected Coding Item by identity after reordering", async () => {
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", { ...values, itemId: "original-coding" }),
  ).toMatchObject({ success: true });
  expect(db.item.findFirst).toHaveBeenCalledWith({
    where: { assignmentId: "post", kind: "coding", id: "original-coding" },
    orderBy: { position: "asc" },
  });
});
it("does not modify a foreign or removed Coding Item", async () => {
  db.item.findFirst.mockResolvedValue(null);
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", { ...values, itemId: "foreign" }),
  ).toMatchObject({ success: false });
  expect(db.item.update).not.toHaveBeenCalled();
});
