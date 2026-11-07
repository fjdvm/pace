import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { prisma } from "@/lib/prisma";
import { mockAuthenticatedUser } from "../../../test/mock-auth";

const ai = vi.hoisted(() => ({ extractWithGemini: vi.fn() }));
vi.mock("@/lib/ai-import/gemini-extractor", () => ({ ...ai, MissingKeyError: class extends Error {} }));
let instructorId: string;
let otherId: string;
let classId: string;

beforeEach(async () => {
  instructorId = randomUUID(); otherId = randomUUID();
  await prisma.user.createMany({ data: [instructorId, otherId].map((id) => ({ id, email: `${id}@test.com` })) });
  const cls = await prisma.class.create({ data: { instructorId, name: "Import test", joinCode: randomUUID() } });
  classId = cls.id;
  mockAuthenticatedUser(instructorId);
  ai.extractWithGemini.mockReset();
});
afterEach(async () => {
  await prisma.user.deleteMany({ where: { id: { in: [instructorId, otherId] } } });
  vi.resetModules(); vi.doUnmock("@/lib/supabase/server");
});
function upload(name = "sheet.pdf", type = "application/pdf", content: BlobPart = "test") {
  const form = new FormData();
  form.set("classId", classId);
  form.set("file", new File([content], name, { type }));
  return form;
}
function ready() {
  ai.extractWithGemini.mockResolvedValue({ title: "Loops", pages: 1, items: [{ kind: "short_answer", title: "Explain a loop", points: 10 }] });
}
it.each([["sheet.pdf", "application/pdf"], ["sheet.jpg", "image/jpeg"], ["sheet.png", "image/png"]])("reads %s for the real Class owner without publishing", async (name, type) => {
  ready();
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(upload(name, type))).toMatchObject({ success: true, draft: { fileName: name, items: [{ title: "Explain a loop" }] } });
  expect(await prisma.assignmentClass.count({ where: { classId } })).toBe(0);
});
it("rejects a different Instructor against real ownership", async () => {
  mockAuthenticatedUser(otherId);
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(upload())).toMatchObject({ success: false, error: expect.stringContaining("Instructor") });
  expect(ai.extractWithGemini).not.toHaveBeenCalled();
});
it("rejects unsupported and unreadable Word files before AI", async () => {
  const { extractItems } = await import("./extract-items");
  expect(await extractItems(upload("sheet.zip", "application/zip"))).toMatchObject({ success: false, error: expect.stringContaining("PDF") });
  expect(await extractItems(upload("sheet.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))).toMatchObject({ success: false, error: expect.stringContaining("Word") });
  expect(ai.extractWithGemini).not.toHaveBeenCalled();
});
it("allows retrying the same file after a read failure", async () => {
  const { extractItems } = await import("./extract-items");
  ai.extractWithGemini.mockRejectedValueOnce(new Error("Unreadable"));
  expect(await extractItems(upload())).toMatchObject({ success: false });
  ready();
  expect(await extractItems(upload())).toMatchObject({ success: true });
});

it("converts a real Word document before extraction", async () => {
  ready();
  const { extractItems } = await import("./extract-items");
  const bytes = readFileSync("test/fixtures/import-sheet.docx");
  expect(await extractItems(upload("sheet.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new Uint8Array(bytes)))).toMatchObject({ success: true });
  expect(ai.extractWithGemini.mock.calls[0][0]).toEqual({ kind: "docx", text: "Explain a loop." });
});
