"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { WorkspaceViewProps } from "@/components/features/assignments/types";
import { WorkspaceContent } from "./workspace-content";

export function StudentWorkspaceView(props: WorkspaceViewProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  if (props.assignment.monitoringEnabled !== false && !props.initialSubmission && !acknowledged) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-pace-canvas p-4">
        <section aria-labelledby="recording-title" className="max-w-md space-y-4 rounded-xl border border-pace-line bg-white p-6">
          <h1 id="recording-title" className="text-xl font-bold">Activity monitoring</h1>
          <p>Your activity is recorded while you work on this Post, including typing, pasting, and tab switches.</p>
          <Button onClick={() => setAcknowledged(true)}>Continue to Post</Button>
        </section>
      </main>
    );
  }
  return <WorkspaceContent {...props} />;
}
