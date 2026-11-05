"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { TestRunResult } from "@/components/features/assignments/types";
import { TestResults } from "./test-results";
import { WorkspaceActions } from "./workspace-actions";

type Props = {
  editor: React.ReactNode;
  tutor: React.ReactNode;
  instructions: React.ReactNode;
  results: TestRunResult[] | null;
  hiddenCount: number;
  consoleOutput: string;
  isRunning: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onRun: () => void;
  onSubmit: () => void;
};
export function MobileWorkspace(props: Props) {
  const [tab, setTab] = useState<string | number>("code");
  const results = props.results?.filter((r) => r.visible !== false) ?? [];
  const passed = results.filter((r) => r.passed).length;
  const failure = results.findIndex((r) => !r.passed);
  return (
    <>
      <Tabs value={tab} onValueChange={setTab} className="min-h-0 flex-1 gap-0">
        <div className="px-4 py-2.5">
          <TabsList className="h-11! w-full gap-1 rounded-[20px] bg-pace-sunken p-1">
            {[
              ["code", "Code"],
              ["tests", "Tests"],
              ["tutor", "AI tutor"],
            ].map(([value, label]) => (
              <TabsTrigger
                key={value}
                value={value}
                data-tutor={value === "tutor" ? "" : undefined}
                className="rounded-[16px] py-2 text-[13px] font-normal data-active:bg-white data-active:font-bold data-active:shadow-none"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent
          value="code"
          keepMounted
          className="min-h-0 overflow-hidden data-[hidden]:hidden"
        >
          {props.editor}
        </TabsContent>
        <TabsContent
          value="tests"
          className="min-h-0 overflow-y-auto px-4 pt-2"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold">Visible tests</h2>
            {!!results.length && (
              <PaceTag tone={passed === results.length ? "green" : "amber"}>
                {passed} of {results.length} passed
              </PaceTag>
            )}
          </div>
          {results.length ? (
            <TestResults results={results} mobile />
          ) : (
            <p className="text-[13px] text-pace-muted">
              Run your code to check it against the test cases.
            </p>
          )}
          <p className="my-3 text-[13px] text-pace-muted">
            {props.hiddenCount} hidden tests run when you turn in.
          </p>
          {failure >= 0 && (
            <Button
              variant="ghost"
              onClick={() => setTab("tutor")}
              className="h-auto w-full justify-start gap-2 rounded-[8px] bg-pace-purple-tint px-3.5 py-2.5 text-[13px] font-bold text-pace-purple"
            >
              ✦ Stuck on test {failure + 1}? Ask the AI tutor for a hint.
            </Button>
          )}
          {props.consoleOutput.startsWith("ERROR:") && (
            <p role="alert" className="mt-3 text-[13px] text-pace-red">
              {props.consoleOutput}
            </p>
          )}
          <details className="my-4 text-[13px]">
            <summary className="cursor-pointer font-bold">Instructions</summary>
            {props.instructions}
          </details>
        </TabsContent>
        <TabsContent
          value="tutor"
          keepMounted
          className="min-h-0 overflow-hidden data-[hidden]:hidden"
        >
          {props.tutor}
        </TabsContent>
      </Tabs>
      {tab !== "tutor" && <footer className="flex shrink-0 gap-3 border-t border-pace-line px-4 pb-7 pt-3">
        <WorkspaceActions {...props} mobile />
      </footer>}
    </>
  );
}
