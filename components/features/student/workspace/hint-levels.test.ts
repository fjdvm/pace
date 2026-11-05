import { expect, it } from "vitest";
import { hintLevelForMessage, nextHintLevel } from "./hint-levels";
it("keeps captions aligned with spent hearts when an accepted request has no reply", () => {
  const messages = [{ role: "user" }, { role: "user" }, { role: "assistant" }];
  expect(hintLevelForMessage(messages, 2)).toBe(2);
});
it("caps subsequent hint levels at five", () => {
  expect(nextHintLevel(10)).toBe(5);
  expect(hintLevelForMessage(Array.from({ length: 8 }, () => ({ role: "user" })), 7)).toBe(5);
});

it("uses the server's actual tier even when a rejected request remains in local chat", () => {
  expect(hintLevelForMessage([{ role: "user" }, { role: "user" }, { role: "assistant", hintLevel: 1 }], 2)).toBe(1);
});
