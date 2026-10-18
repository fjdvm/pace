"use client";

import { toast } from "sonner";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";

export function ClassCodeCard({ code }: { code: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Class code copied");
    } catch {
      toast.error("Could not copy the code");
    }
  };

  return (
    <div className="flex items-center gap-2.5 rounded-[14px] bg-pace-sunken px-4 py-3">
      <span className="text-[13px] text-pace-ink-2">Class code</span>
      <span className="font-mono text-[13px] text-pace-ink">{code}</span>
      <span className="flex-1" />
      <button type="button" onClick={copy} aria-label="Copy class code" className="cursor-pointer">
        <PaceIcon name="copy" size={16} />
      </button>
    </div>
  );
}
