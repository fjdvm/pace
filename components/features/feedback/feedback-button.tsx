"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { FeedbackModal } from "./feedback-modal";

const WORKSPACE_PATH = "/dashboard/student/assignments/";

export function FeedbackButton({ inline = false }: { inline?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (!inline && pathname.startsWith(WORKSPACE_PATH)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report an issue"
        className={
          inline
            ? "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-pace-line-strong bg-white text-pace-ink"
            : "fixed bottom-6 right-6 z-[9999] w-12 h-12 rounded-full bg-pace-ink text-white shadow-[0_4px_0_0_var(--color-pace-line-strong)] hover:scale-105 transition-all cursor-pointer flex items-center justify-center"
        }
      >
        <HelpCircle className="h-5 w-5" />
      </button>
      <FeedbackModal open={open} onOpenChange={setOpen} />
    </>
  );
}
