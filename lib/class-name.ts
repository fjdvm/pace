const SEPARATOR = " · ";

export function splitClassName(name: string) {
  const index = name.indexOf(SEPARATOR);
  if (index === -1) return { code: name.trim(), description: "" };
  return {
    code: name.slice(0, index).trim(),
    description: name.slice(index + SEPARATOR.length).trim(),
  };
}

export function composeClassName(code: string, description: string) {
  const trimmedCode = code.trim();
  const trimmedDescription = description.trim();
  return trimmedDescription ? `${trimmedCode}${SEPARATOR}${trimmedDescription}` : trimmedCode;
}
