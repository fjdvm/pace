const PREFIX = /^New assignment posted:\s*/i;

export function assignmentTitle(body: string | null) {
  return (body ?? "").replace(PREFIX, "");
}

export function professorLabel(name: string) {
  const last = name.trim().replace(/^prof\.?\s+/i, "").split(/\s+/).pop() ?? name;
  return `Prof. ${last}`;
}
