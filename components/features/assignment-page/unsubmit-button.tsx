"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { unsubmitSubmission } from "@/app/actions/unsubmit-submission";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";

export function UnsubmitButton({ postId }: { postId: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <div className="flex flex-1 flex-col gap-2">
      <Button
        disabled={pending}
        className={`${paceButtonBase} ${paceButtonStyles.secondary} h-[52px] w-full text-[15px]`}
        onClick={() =>
          start(async () => {
            try {
              await unsubmitSubmission(postId);
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Could not unsubmit");
            }
          })
        }
      >
        {pending ? "Unsubmitting…" : "Unsubmit"}
      </Button>
      {error && (
        <p role="alert" className="text-[13px] text-pace-red">
          {error}
        </p>
      )}
    </div>
  );
}
