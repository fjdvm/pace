import { ItemRow } from "./item-row";
import type { AssignmentItem } from "./types";

type ItemsListProps = {
  items: AssignmentItem[];
  hrefFor: (item: AssignmentItem) => string;
};

export function ItemsList({ items, hrefFor }: ItemsListProps) {
  if (items.length === 0) return null;
  return (
    <ul className="hidden flex-col overflow-hidden rounded-[12px] border border-pace-line bg-white md:flex">
      {items.map((item, index) => (
        <ItemRow key={item.id} item={item} index={index} href={hrefFor(item)} />
      ))}
    </ul>
  );
}
