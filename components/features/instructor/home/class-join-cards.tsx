"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { classTone } from "@/components/features/shared/class-tone";
import { splitClassName } from "@/lib/class-name";
import type { InstructorClassSummary } from "@/components/features/instructor/types";

export function ClassJoinCards({ classes }: { classes: InstructorClassSummary[] }) {
  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Join code copied");
    } catch {
      toast.error("Could not copy the code");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((cls, index) => {
        const purple = classTone(index) === "purple";
        const { code, description } = splitClassName(cls.name);
        return (
          <div
            key={cls.id}
            className="flex items-center gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-4 shadow-[0_3px_0_0_var(--color-pace-line)]"
          >
            <Link href={`/dashboard/instructor/classes/${cls.id}`} className="flex min-w-0 flex-1 items-center gap-3.5">
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-[14px]",
                  purple ? "bg-pace-purple-tint text-pace-purple" : "bg-pace-green-tint text-pace-green-deep",
                )}
              >
                <GraduationCap className="size-5" strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[15px] font-bold text-pace-ink">
                  {description ? `${code} · ${description}` : code}
                </span>
                <span className="text-xs text-pace-muted">
                  {cls.studentCount} {cls.studentCount === 1 ? "student" : "students"}
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => copy(cls.joinCode)}
              aria-label={`Copy join code ${cls.joinCode}`}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-pace-sunken px-3 py-2 text-xs"
            >
              <span className="text-pace-muted">Join code</span>
              <span className="font-mono font-semibold text-pace-ink">{cls.joinCode}</span>
              <PaceIcon name="copy" size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
