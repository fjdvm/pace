const SEPARATOR = " · ";

export function splitClassName(name: string) {
  const index = name.indexOf(SEPARATOR);
  if (index === -1) return { code: name.trim(), description: "" };
  return {
    code: name.slice(0, index).trim(),
    description: name.slice(index + SEPARATOR.length).trim(),
  };
}

export function composeClassName(code: string, description: string, section = "") {
  const parts = [code, description, section].map((part) => part.trim());
  if (!parts[1]) return parts[0];
  return parts.filter(Boolean).join(SEPARATOR);
}

export function splitSection(name: string) {
  const parts = name.split(SEPARATOR).map((part) => part.trim());
  if (parts.length < 3) return { title: name.trim(), section: null };
  return { title: parts.slice(0, -1).join(SEPARATOR), section: parts[parts.length - 1] };
}
