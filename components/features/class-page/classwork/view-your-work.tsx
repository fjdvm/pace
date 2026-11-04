import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

export function ViewYourWork() {
  return (
    <Link href="/dashboard/todo" className="flex items-center gap-2 self-start text-[13px] font-bold text-pace-green-deep">
      <ClipboardCheck className="size-4" /> View your work
    </Link>
  );
}
