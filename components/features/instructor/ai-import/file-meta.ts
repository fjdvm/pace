export function fileSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function fileBadge(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return { label: "PDF", className: "bg-pace-red-tint text-pace-red" };
  if (ext === "docx") return { label: "DOC", className: "bg-pace-blue-tint text-pace-blue" };
  return { label: "IMG", className: "bg-pace-amber-tint text-pace-ink" };
}
