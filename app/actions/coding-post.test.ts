import { expect, it } from "vitest";
import { auth, db, values } from "../../test/coding-post-fixture";

it("saves a Draft with its coding Item and no Stream entry", async () => {
  const { createAssignment } = await import("./create-assignment");
  expect(await createAssignment({ ...values, isDraft: true })).toMatchObject({
    success: true,
  });
  expect(db.item.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: { starterCode: values.starterCode, points: 50 },
    }),
  );
  expect(db.post.createMany).not.toHaveBeenCalled();
});

it("assigns a saved Draft once, creating a Stream entry", async () => {
  const { updateAssignment } = await import("./update-assignment");
  const result = await updateAssignment("post", { ...values, isDraft: false });
  expect(result.error).toBeUndefined();
  expect(result).toMatchObject({ success: true });
  expect(db.assignment.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ isDraft: false }),
    }),
  );
  expect(db.post.createMany).toHaveBeenCalledWith({
    data: [expect.objectContaining({ assignmentId: "post", classId: "class" })],
  });
});

it("does not duplicate Stream entries when saving an assigned Post", async () => {
  const post = await db.assignment.findUnique();
  db.assignment.findUnique.mockResolvedValue({ ...post, isDraft: false });
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", { ...values, isDraft: false }),
  ).toMatchObject({ success: true });
  expect(db.post.createMany).not.toHaveBeenCalled();
});

it("allows an incomplete Draft but validates it before assigning", async () => {
  const { createAssignment } = await import("./create-assignment");
  expect(
    await createAssignment({
      ...values,
      instructions: "",
      testCases: [],
      isDraft: true,
    }),
  ).toMatchObject({ success: true });
  expect(
    await createAssignment({ ...values, instructions: "", isDraft: false }),
  ).toMatchObject({ success: false });
});

it.each(["create", "update"])(
  "rejects %s into a Class taught by another Instructor",
  async (operation) => {
    db.class.count.mockResolvedValue(0);
    const { createAssignment } = await import("./create-assignment");
    const { updateAssignment } = await import("./update-assignment");
    expect(
      await (operation === "create"
        ? createAssignment(values)
        : updateAssignment("post", values)),
    ).toMatchObject({ success: false });
    expect(db.assignment.create).not.toHaveBeenCalled();
    expect(db.assignment.update).not.toHaveBeenCalled();
  },
);

it("rejects editing a Post when the User is a Student in its Class", async () => {
  const post = await db.assignment.findUnique();
  db.assignment.findUnique.mockResolvedValue({
    ...post,
    classes: [{ classId: "class", class: { instructorId: "other" } }],
  });
  const { updateAssignment } = await import("./update-assignment");
  expect(await updateAssignment("post", values)).toMatchObject({
    success: false,
  });
  expect(db.assignment.update).not.toHaveBeenCalled();
});

it.each(["tests", "language", "starter code"])(
  "rejects changing %s after a Student starts",
  async (change) => {
    const post = await db.assignment.findUnique();
    db.assignment.findUnique.mockResolvedValue({
      ...post,
      isDraft: false,
      _count: { ...post._count, codeDrafts: 1 },
    });
    const { updateAssignment } = await import("./update-assignment");
    const patch =
      change === "tests"
        ? { testCases: [{ ...values.testCases[0], expectedOutput: "8" }] }
        : change === "language"
          ? { language: "C" }
          : { starterCode: "new" };
    expect(
      await updateAssignment("post", { ...values, ...patch }),
    ).toMatchObject({ success: false });
    expect(db.assignment.update).not.toHaveBeenCalled();
  },
);

it("allows text, due date and points edits after a Student starts", async () => {
  const post = await db.assignment.findUnique();
  db.assignment.findUnique.mockResolvedValue({
    ...post,
    isDraft: false,
    _count: { ...post._count, submissions: 1 },
  });
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", {
      ...values,
      title: "New Post title",
      itemTitle: "New Item title",
      instructions: "New text",
      itemInstructions: "New text",
      points: 75,
      dueDate: "2099-11-01T12:00",
    }),
  ).toMatchObject({ success: true });
  expect(db.item.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ title: "New Item title", points: 75 }),
    }),
  );
  expect(db.testCase.deleteMany).not.toHaveBeenCalled();
});

it("preserves an independent Item title when editing a Post title", async () => {
  db.item.findFirst.mockResolvedValue({
    id: "post",
    ...values,
    title: "Independent Item",
  });
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", { ...values, title: "New Post" }),
  ).toMatchObject({ success: true });
  expect(db.item.update).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ title: "Independent Item" }),
    }),
  );
});

it("rejects unauthenticated creation", async () => {
  auth.userId = null;
  const { createAssignment } = await import("./create-assignment");
  expect(await createAssignment(values)).toMatchObject({ success: false });
  expect(db.assignment.create).not.toHaveBeenCalled();
});

it("rejects an assigned Post becoming a Draft", async () => {
  const post = await db.assignment.findUnique();
  db.assignment.findUnique.mockResolvedValue({ ...post, isDraft: false });
  const { updateAssignment } = await import("./update-assignment");
  expect(
    await updateAssignment("post", { ...values, isDraft: true }),
  ).toMatchObject({ success: false });
});
