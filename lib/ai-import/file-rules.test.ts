import { expect, it } from "vitest";
import { checkImportFile, MAX_IMPORT_BYTES } from "./file-rules";

it("accepts PDF, Word and image files", () => {
  expect(checkImportFile({ name: "a.pdf", type: "application/pdf", size: 10 })).toEqual({ kind: "pdf" });
  expect(checkImportFile({ name: "a.docx", type: "", size: 10 })).toEqual({ kind: "docx" });
  expect(checkImportFile({ name: "a.PNG", type: "image/png", size: 10 })).toEqual({ kind: "image" });
});

it("rejects wrong type, empty and oversized files", () => {
  expect(checkImportFile({ name: "a.zip", type: "application/zip", size: 10 })).toHaveProperty("error");
  expect(checkImportFile({ name: "a.pdf", type: "application/pdf", size: 0 })).toHaveProperty("error");
  expect(checkImportFile({ name: "a.pdf", type: "application/pdf", size: MAX_IMPORT_BYTES + 1 })).toMatchObject({ error: expect.stringContaining("20 MB") });
});
