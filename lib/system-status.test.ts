import { describe, expect, it } from "vitest";
import { buildSystemStatus, isOperational } from "./system-status";

const healthy = { groqKey: true, googleKey: true, encryptionKey: true, codeExecution: true };

describe("buildSystemStatus", () => {
  it("reports Groq as primary and Google as backup when both keys exist", () => {
    const [tutor, backup, execution, encryption] = buildSystemStatus(healthy);
    expect(tutor).toMatchObject({ title: "AI tutor provider", detail: "Groq · openai/gpt-oss-120b", state: "ok" });
    expect(backup).toMatchObject({ title: "Backup provider", detail: "Google AI key set", state: "ok" });
    expect(execution.state).toBe("ok");
    expect(encryption).toMatchObject({ detail: "AES-256-GCM key configured", state: "ok" });
  });

  it("marks the backup optional when only Groq is set", () => {
    const [, backup] = buildSystemStatus({ ...healthy, googleKey: false });
    expect(backup).toMatchObject({ detail: "Google AI key not set", state: "optional" });
  });

  it("falls back to Google as primary when Groq is missing", () => {
    const [tutor, backup] = buildSystemStatus({ ...healthy, groqKey: false });
    expect(tutor.detail).toBe("Google AI · gemini-1.5-flash");
    expect(backup).toMatchObject({ detail: "Groq key not set", state: "optional" });
  });

  it("flags a missing tutor provider as an error", () => {
    const [tutor] = buildSystemStatus({ ...healthy, groqKey: false, googleKey: false });
    expect(tutor).toMatchObject({ detail: "No API key configured", state: "error" });
  });
});

describe("isOperational", () => {
  it("is true unless an item errors", () => {
    expect(isOperational(buildSystemStatus(healthy))).toBe(true);
    expect(isOperational(buildSystemStatus({ ...healthy, encryptionKey: false }))).toBe(false);
  });
});
