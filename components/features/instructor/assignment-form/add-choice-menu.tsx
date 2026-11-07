import { useMediaQuery } from "@/hooks/use-media-query";
import { MobileAddChoice } from "./mobile-add-choice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Kind = "coding" | "multiple_choice" | "short_answer";
const kinds: { kind: Kind; icon: string; title: string; description: string }[] = [
  { kind: "coding", icon: "</>", title: "Coding", description: "Editor, test cases, AI tutor" },
  { kind: "multiple_choice", icon: "◉", title: "Multiple choice", description: "Options with one correct answer" },
  { kind: "short_answer", icon: "Aa", title: "Short answer", description: "Typed answer, graded by you" },
];

export function AddChoiceMenu({ disabled, onAdd, classId, onOpen }: {
  disabled: boolean; onAdd: (kind: Kind) => void; classId?: string; onOpen?: () => void;
}) {
  const desktop = useMediaQuery("(min-width: 768px)");
  if (!desktop) return <MobileAddChoice disabled={disabled} classId={classId} onAdd={onAdd} onOpen={onOpen} />;
  return (
    <DropdownMenu onOpenChange={(open) => { if (open) onOpen?.(); }}>
      <DropdownMenuTrigger render={<Button variant="outline" disabled={disabled} className="h-10 rounded-full bg-white px-[18px] shadow-[0_3px_0_#d6d3cb]" />}>
        + Add item
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80 max-w-[calc(100vw-32px)] rounded-[12px] p-1.5">
        {kinds.map(({ kind, icon, title, description }) => (
          <DropdownMenuItem key={kind} onClick={() => onAdd(kind)} className="gap-3 rounded-[8px] p-3">
            <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pace-green-tint text-[11px] font-bold text-pace-green">{icon}</span>
            <span><b className="block text-[15px]">{title}</b><span className="text-[13px] text-pace-muted">{description}</span></span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={`/dashboard/assignments/import?classId=${classId ?? ""}`} />} className="gap-3 rounded-[8px] p-3">
          <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pace-purple-tint text-pace-purple">✦</span>
          <span><b className="block text-[15px]">Import from a file</b><span className="text-[13px] text-pace-muted">AI adds items from a PDF, Word or photo</span></span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
