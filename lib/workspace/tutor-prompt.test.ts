import { expect, it } from "vitest";
import { buildSystemPrompt } from "./tutor-prompt";
it("provides Item instructions, current code, results and the progressively stronger hint tier", () => {
  const prompt = buildSystemPrompt({ title: "Sum", instructions: "Add two inputs", language: "Python" }, "print(0)", [{ passed: false }], 2, 2);
  for (const text of ["Sum", "Add two inputs", "print(0)", '"passed": false', "Current Tier: 2", "never ask them to paste it"])
    expect(prompt).toContain(text);
});
it("handles an empty editor and absent run results", () => {
  expect(buildSystemPrompt({ title: "Item", instructions: "Read input", language: "Python" }, "", null, 0, 1)).toContain("// No code written yet");
});
