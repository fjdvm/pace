import { ClassworkRow } from "./classwork-row";
import { sortByDue } from "./sort-by-due";
import type { ClassworkItem } from "./types";

type ClassworkListProps = {
  items: ClassworkItem[];
  hrefFor: (item: ClassworkItem) => string;
  menuFor?: (item: ClassworkItem) => React.ReactNode;
};

export function ClassworkList({ items, hrefFor, menuFor }: ClassworkListProps) {
  if (items.length === 0) {
    return <p className="py-10 text-center text-[13px] text-pace-ink-2">No work posted yet.</p>;
  }
  return (
    <div className="flex flex-col border-t border-pace-line">
      {sortByDue(items).map((item) => (
        <ClassworkRow key={item.id} item={item} href={hrefFor(item)} menu={menuFor?.(item)} />
      ))}
    </div>
  );
}
