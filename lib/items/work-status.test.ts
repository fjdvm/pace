import { expect, it } from "vitest";
import { itemWorkStatus } from "./work-status";

it("keeps untouched and restored starter code not started", () => {
  expect(
    itemWorkStatus({ kind: "coding", starterCode: "print(1)" }, "print(1)"),
  ).toBe("not-started");
  expect(itemWorkStatus({ kind: "short_answer" }, "  ")).toBe("not-started");
});
it("marks code in progress until nonempty tests all pass", () => {
  const item = { kind: "coding", starterCode: "" };
  expect(itemWorkStatus(item, "print(2)", [])).toBe("in-progress");
  expect(itemWorkStatus(item, "print(2)", [{ passed: false }])).toBe(
    "in-progress",
  );
  expect(itemWorkStatus(item, "print(2)", [{ passed: true }])).toBe("answered");
});
it("counts option zero and nonblank short answers as answered", () => {
  expect(itemWorkStatus({ kind: "multiple_choice" }, "0")).toBe("answered");
  expect(itemWorkStatus({ kind: "short_answer" }, "A loop repeats.")).toBe(
    "answered",
  );
});
it("does not treat blank code with passing results as an answer", () => {
  expect(itemWorkStatus({ kind: "coding" }, "", [{ passed: true }])).toBe(
    "not-started",
  );
});
