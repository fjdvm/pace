export const CLASS_COLOURS = ["#11923a", "#5b7cfa", "#8b5cf6"] as const;

export type ClassColour = (typeof CLASS_COLOURS)[number];

export function classColour(classId: string): ClassColour {
  let hash = 0;
  for (let index = 0; index < classId.length; index += 1) {
    hash = (hash * 31 + classId.charCodeAt(index)) >>> 0;
  }
  return CLASS_COLOURS[hash % CLASS_COLOURS.length];
}
