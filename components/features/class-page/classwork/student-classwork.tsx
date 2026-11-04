import { ClassworkList } from "./classwork-list";
import type { ClassworkItem } from "./types";

export function StudentClasswork({ items }: { items: ClassworkItem[] }) {
  return <ClassworkList items={items} hrefFor={(item) => `/dashboard/assignments/${item.id}`} />;
}
