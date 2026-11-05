import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function AddChoiceMenu({
  disabled,
  onAdd,
}: {
  disabled: boolean;
  onAdd: (kind: "multiple_choice" | "short_answer") => void;
}) {
  return (
    <div className="flex justify-center rounded-[12px] border border-dashed border-pace-line-strong p-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              disabled={disabled}
              className="h-10 rounded-full bg-white px-[18px] shadow-[0_3px_0_#d6d3cb]"
            />
          }
        >
          + Add item
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 rounded-[12px] p-1.5">
          <DropdownMenuItem onClick={() => onAdd("multiple_choice")} className="rounded-[8px] p-3">
            <span className="mr-3 flex size-8 items-center justify-center rounded-full bg-pace-green-tint text-pace-green">
              ◉
            </span>
            <span>
              <b className="block text-[15px]">Multiple choice</b>
              <span className="text-[13px] text-pace-muted">
                Options with one correct answer
              </span>
            </span>
          </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("short_answer")} className="rounded-[8px] p-3"><span className="mr-3 flex size-8 items-center justify-center rounded-full bg-pace-amber-tint">≡</span><span><b className="block text-[15px]">Short answer</b><span className="text-[13px] text-pace-muted">A written answer graded by the Instructor</span></span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
