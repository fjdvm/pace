import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { mockAuthenticatedUser, mockUnauthenticated } from "../../../test/mock-auth";

const db = vi.hoisted(() => ({ class: { count: vi.fn() } }));
vi.mock("@/lib/prisma", () => ({ prisma: db }));
const gemini = vi.hoisted(() => ({ extractWithGemini: vi.fn() }));
vi.mock("@/lib/ai-import/gemini-extractor", () => {
  class MissingKeyError extends Error {
    constructor() { super("AI import is not set up yet. Ask an Admin to add the Gemini key."); }
  }
  return { ...gemini, MissingKeyError };
});
const docx = vi.hoisted(() => ({ docxToText: vi.fn() }));
vi.mock("@/lib/ai-import/docx-text", () => docx);

function form(file: File | null, extra: Record<string, string> = {}) {
  const f = new FormData();
  f.set("classId", "c1");
  f.set("writeTests", "true");
  f.set("detectKeys", "true");
  Object.entries(extra).forEach(([k, v]) => f.set(k, v));
  if (file) f.set("file", file);
  return f;
}
const pdf = () => new File([new Uint8Array([1, 2, 3])], "sheet.pdf", { type: "application/pdf" });

beforeEach(() => {
  vi.resetAllMocks();
  mockAuthenticatedUser("instructor");
  db.class.count.mockResolvedValue(1);
  docx.docxToText.mockResolvedValue("Item 1");
});

it("returns an editable draft and drops malformed Items with a count", async () => {
  gemini.extractWithGemini.mockResolvedValue({ title: "Lab", instructions: "Do it", pages: 2, items: [
    { kind: "short_answer", title: "Explain", instructions: "", points: 10, sourceText: "Explain" }, { kind: "bad" },
  ] });
  const { extractItems } = await import("./extract-items");
  const result = await extractItems(form(pdf()));
  expect(result).toMatchObject({ success: true, draft: { title: "Lab", fileName: "sheet.pdf", dropped: 1, items: [{ kind: "short_answer", fromFile: true }] } });
  expect(gemini.extractWithGemini.mock.calls[0][0]).toMatchObject({ kind: "pdf", mediaType: "application/pdf" });
});

it("converts Word files to text before calling Gemini", async () => {
  gemini.extractWithGemini.mockResolvedValue({ title: "", items: [{ kind: "short_answer", title: "Q" }] });
  const { extractItems } = await import("./extract-items");
  await extractItems(form(new File(["x"], "a.docx")));
  expect(gemini.extractWithGemini.mock.calls[0][0]).toEqual({ kind: "docx", text: "Item 1" });
});

it.each([
  ["wrong type", new File(["x"], "a.zip", { type: "application/zip" }), "PDF"],
  ["too large", new File([new Uint8Array(20 * 1024 * 1024 + 1)], "a.pdf", { type: "application/pdf" }), "20 MB"],
  ["missing", null, "Choose a file"],
])("rejects a file that is %s", async (_n, file, text) => {
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(form(file))).toMatchObject({ success: false, error: expect.stringContaining(text) });
  expect(gemini.extractWithGemini).not.toHaveBeenCalled();
});

it("shows clear errors for an unreadable file and a missing key", async () => {
  const { extractItems } = await import("./extract-items");
  gemini.extractWithGemini.mockRejectedValueOnce(new Error("boom"));
  expect(await extractItems(form(pdf()))).toMatchObject({ success: false, error: expect.stringContaining("could not read") });
  const { MissingKeyError } = await import("@/lib/ai-import/gemini-extractor");
  gemini.extractWithGemini.mockRejectedValueOnce(new MissingKeyError());
  expect(await extractItems(form(pdf()))).toMatchObject({ success: false, error: expect.stringContaining("Gemini key") });
});

it("reports a file with no usable Items", async () => {
  gemini.extractWithGemini.mockResolvedValue({ title: "", items: [{ kind: "bad" }] });
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(form(pdf()))).toMatchObject({ success: false, error: expect.stringContaining("No items") });
});

it("requires the Instructor of the Class", async () => {
  const { extractItems } = await import("./extract-items");
  db.class.count.mockResolvedValue(0);
  expect(await extractItems(form(pdf()))).toMatchObject({ success: false });
  expect(gemini.extractWithGemini).not.toHaveBeenCalled();
});

it("requires login", async () => {
  mockUnauthenticated();
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(form(pdf()))).toMatchObject({ success: false, error: expect.stringContaining("logged in") });
  expect(gemini.extractWithGemini).not.toHaveBeenCalled();
});

afterEach(() => { vi.resetModules(); vi.doUnmock("@/lib/supabase/server"); });
