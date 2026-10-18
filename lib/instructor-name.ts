import { getDisplayName } from "./display-name";

type NameSource = { name?: string | null; email: string };

export function instructorTitle(user: NameSource) {
  const display = getDisplayName(user);
  return /^prof\.?\s/i.test(display) ? display : `Prof. ${display}`;
}

export function instructorLastName(user: NameSource) {
  const words = instructorTitle(user).split(/\s+/);
  return `Prof. ${words[words.length - 1]}`;
}
