import { expect, it } from "vitest";
import { auth, db, item, post } from "../../test/workspace-fixture";
import { runCode } from "./run-code";
it("runs only the selected Item's visible tests", async () => {
  db.assignment.findUnique.mockResolvedValue({ ...post, items: [item, { ...item, id: "two", language: "JavaScript" }] });
  const result = await runCode("post", "console.log(7)", "two");
  expect(result.success).toBe(true);
  expect(result.results).toHaveLength(1);
  expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ body: expect.stringContaining('"language_id":102') }));
  expect(result.results?.[0].testCaseId).toBe("visible");
});
it("rejects foreign Items and unauthorized Users without executing", async () => {
  expect((await runCode("post", "code", "foreign")).success).toBe(false);
  auth.userId = "instructor"; expect((await runCode("post", "code", "one")).success).toBe(false);
  auth.userId = null; expect((await runCode("post", "code", "one")).success).toBe(false);
  db.enrollment.findFirst.mockResolvedValue(null); auth.userId = "outsider";
  expect((await runCode("post", "code", "one")).success).toBe(false);
  expect(fetch).not.toHaveBeenCalled();
});
