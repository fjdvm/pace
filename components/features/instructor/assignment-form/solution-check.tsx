"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { checkCodingSolution } from "@/app/actions/check-coding-solution";
import type { TestCaseForm } from "@/lib/assignment-form";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";

type Props = { classId?: string; language: string; testCases: TestCaseForm[] };

export function SolutionCheck({ classId, language, testCases }: Props) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ signature: string; message: string; passed: boolean }>();
  const signature = JSON.stringify({ language, testCases, code });
  const current = result?.signature === signature ? result : undefined;
  const check = async () => {
    if (!classId || busy) return;
    setBusy(true);
    try {
      const response = await checkCodingSolution({ classId, language, code, testCases });
      const passed = response.success && response.results.every((test) => test.passed);
      setResult({ signature, passed, message: response.success
        ? passed ? `✓ Your solution passes all ${response.results.length} tests` : `${response.results.filter((test) => test.passed).length} of ${response.results.length} tests passed`
        : response.error });
    } catch { setResult({ signature, passed: false, message: "Could not check solution. Please try again." }); }
    finally { setBusy(false); }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)} className={`${paceButtonBase} ${paceButtonStyles.secondary}`}>
        Check with my solution
      </Button>
      {current && <p role="status" className={`rounded-lg px-3 py-2 text-[13px] font-bold ${current.passed ? "bg-pace-green-tint text-pace-green-deep" : "bg-pace-amber-tint text-pace-ink"}`}>{current.message}</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto">
          <DialogHeader><DialogTitle>Check with my solution</DialogTitle></DialogHeader>
          <label htmlFor="instructor-solution">Your solution · {language}</label>
          <Textarea id="instructor-solution" value={code} onChange={(event) => setCode(event.target.value)} className="min-h-48 font-mono" />
          <p className="text-sm text-pace-muted">Runs visible and hidden tests. Your solution is never included in starter code.</p>
          <Button disabled={!classId || busy || !code.trim()} onClick={check}>{busy ? "Checking…" : "Run all tests"}</Button>
          {current && <p role="status">{current.message}</p>}
        </DialogContent>
      </Dialog>
    </>
  );
}
