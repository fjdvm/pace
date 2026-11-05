export const MAX_IMPORT_BYTES = 20 * 1024 * 1024;

export type ImportFileKind = "pdf" | "image" | "docx";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export function importFileKind(name: string, type: string): ImportFileKind | null {
  const lower = name.toLowerCase();
  if (type === "application/pdf" || lower.endsWith(".pdf")) return "pdf";
  if (type === DOCX_TYPE || lower.endsWith(".docx")) return "docx";
  if (["image/jpeg", "image/png"].includes(type) || /\.(jpe?g|png)$/.test(lower))
    return "image";
  return null;
}

export function imageMediaType(name: string, type: string) {
  return type === "image/png" || name.toLowerCase().endsWith(".png")
    ? "image/png"
    : "image/jpeg";
}

export function checkImportFile(file: { name: string; type: string; size: number }) {
  if (file.size === 0) return { error: "That file is empty." } as const;
  if (file.size > MAX_IMPORT_BYTES)
    return { error: "That file is over 20 MB. Choose a smaller file." } as const;
  const kind = importFileKind(file.name, file.type);
  if (!kind)
    return { error: "Use a PDF, Word (.docx), JPG or PNG file." } as const;
  return { kind } as const;
}
