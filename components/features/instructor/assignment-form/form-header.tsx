import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";
import type { AssignmentFormValues } from "@/lib/assignment-form";

type Props = {
  values: AssignmentFormValues;
  backHref: string;
  savedAt?: string;
  dirty: boolean;
  busy: boolean;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
  onSave: () => void;
  onAssign: () => void;
  onPreview: () => void;
  onDelete?: () => void;
};

export function FormHeader({
  values,
  backHref,
  savedAt,
  dirty,
  busy,
  onChange,
  onSave,
  onAssign,
  onPreview,
  onDelete,
}: Props) {
  return (
    <header className="flex h-[54px] shrink-0 items-center gap-2 border-b border-pace-line bg-white pl-2 pr-4 md:h-16 md:gap-4 md:pl-3 md:pr-5">
      <Link
        href={backHref}
        aria-label="Close Post editor"
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-base text-pace-ink-2"
      >
        ✕
      </Link>
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-pace-green md:flex">
        <Image src="/post/assignment.svg" alt="" width={24} height={24} />
      </span>
      <h1 className="min-w-0 flex-1 truncate text-base font-bold tracking-[-.08px] md:text-xl md:tracking-[-.2px]">
        <span className="md:hidden">{values.label ?? "Activity"}</span>
        <span className="hidden items-center md:flex">
          <span>{values.label ?? "Activity"} · </span>
          <Input
            aria-label="Post title"
            value={values.title}
            onChange={(event) => onChange({ title: event.target.value })}
            placeholder="Coding assignment"
            className="min-w-0 flex-1 rounded-none border-0 bg-transparent px-1 text-xl font-bold shadow-none md:text-xl"
          />
        </span>
      </h1>
      <div className="hidden items-center gap-3 md:flex">
        {values.isDraft && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={onSave}
            className="h-auto p-0 text-[13px] font-normal text-pace-muted"
          >
            {busy
              ? "Saving…"
              : savedAt && !dirty
                ? `Draft saved · ${new Date(savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
                : "Save draft"}
          </Button>
        )}
        {savedAt && !dirty && (
          <time dateTime={savedAt} className="sr-only" aria-live="polite">
            Draft saved at {new Date(savedAt).toLocaleTimeString()}
          </time>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            disabled={busy}
            onClick={onDelete}
            className="text-pace-red"
          >
            Delete
          </Button>
        )}
        <Button
          onClick={onPreview}
          className={`${paceButtonBase} ${paceButtonStyles.secondary}`}
        >
          Preview as student
        </Button>
      </div>
      <Button
        disabled={busy}
        onClick={onAssign}
        className={`${paceButtonBase} ${paceButtonStyles.green}`}
      >
        {busy ? "Saving…" : values.isDraft ? "Assign" : "Save"}
      </Button>
    </header>
  );
}
