import { expect, it } from "vitest";
import { NextRequest } from "next/server";
import { mocks } from "../../../test/tutor-fixture";
import { WorkspaceError } from "@/lib/workspace/workspace-error";
import { POST } from "./route";
const request = (extra = {}) => POST(new NextRequest("http://localhost/api/chat", {
  method: "POST", body: JSON.stringify({ assignmentId: "post", itemId: "two", currentCode: "print(0)",
    messages: [{ role: "user", parts: [{ type: "text", text: "Help" }] }], ...extra }),
}));
it("streams the selected Item's instructions, live code and isolated history", async () => {
  const response = await request();
  expect(response.status).toBe(200);
  expect(response.headers.get("X-Hearts-State")).toContain('"currentCount":4');
  expect(mocks.access).toHaveBeenCalledWith("post", "student");
  expect(mocks.messages.findMany).toHaveBeenCalledWith({
    where: { studentId: "student", assignmentId: "post", itemId: "two" }, orderBy: { createdAt: "asc" },
  });
  const options = mocks.stream.mock.calls[0][0];
  expect(options.system).toContain("Second instructions");
  expect(options.system).toContain("print(0)");
  expect(options.system).not.toContain("First instructions");
  await options.onFinish({ text: "Try tracing your code" });
  expect(mocks.messages.create).toHaveBeenLastCalledWith({ data: {
    studentId: "student", assignmentId: "post", itemId: "two", role: "assistant", content: "Try tracing your code",
  } });
});
it("rejects unauthenticated Users and invalid input before spending hearts", async () => {
  mocks.user.mockResolvedValueOnce({ data: { user: null } });
  expect((await request()).status).toBe(401);
  expect((await request({ itemId: undefined })).status).toBe(400);
  expect((await request({ currentCode: 1 })).status).toBe(400);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
it("rejects outsiders, Instructors, Draft Posts and foreign Items before writing", async () => {
  mocks.access.mockRejectedValueOnce(new WorkspaceError("Only an enrolled Student can work on this Post", 403));
  expect((await request()).status).toBe(403);
  mocks.access.mockRejectedValueOnce(new WorkspaceError("Post not found", 404));
  expect((await request()).status).toBe(404);
  expect((await request({ itemId: "foreign" })).status).toBe(404);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
it("blocks only tutor requests when out of hearts or already turned in", async () => {
  mocks.hearts.findUniqueOrThrow.mockResolvedValueOnce({ currentCount: 0, totalSpent: 5, lastRegenAt: new Date() });
  expect((await request()).status).toBe(403);
  expect(mocks.messages.create).not.toHaveBeenCalled();
  mocks.submission.mockResolvedValueOnce({ id: "submission" });
  expect((await request()).status).toBe(403);
  expect(mocks.stream).not.toHaveBeenCalled();
});
it("does not spend hearts if the model cannot be initialized", async () => {
  mocks.model.mockRejectedValueOnce(new Error("Provider unavailable"));
  expect((await request()).status).toBe(500);
  expect(mocks.transaction).not.toHaveBeenCalled();
});
