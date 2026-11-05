import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { WorkspaceItem } from "@/components/features/assignments/types";
type Props = {
  items: WorkspaceItem[];
  activeId: string;
  disabled: boolean;
  onSelect: (id: string) => void;
};
export function MobileItemMenu({ items, activeId, disabled, onSelect }: Props) {
  const current = items.find((i) => i.id === activeId)!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label="Select Item"
        className="max-w-full truncate text-left outline-none"
      >
        {current.title}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item, index) => (
          <DropdownMenuItem key={item.id} onClick={() => onSelect(item.id)}>
            {index + 1}. {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
