import type { ClassPageTab } from "./types";

export const CLASS_TABS: { id: ClassPageTab; label: string; icon: string; instructorOnly?: boolean }[] = [
  { id: "stream", label: "Stream", icon: "message" },
  { id: "classwork", label: "Classwork", icon: "book" },
  { id: "people", label: "People", icon: "people" },
  { id: "grades", label: "Grades", icon: "people", instructorOnly: true },
];

export function tabsFor(isInstructor: boolean) {
  return CLASS_TABS.filter((tab) => isInstructor || !tab.instructorOnly);
}
