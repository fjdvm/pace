"use client";

import { useDefaultLayout } from "react-resizable-panels";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceResizeHandle } from "./workspace-resize-handle";

type DesktopWorkspaceLayoutProps = {
  instructions: React.ReactNode;
  editor: React.ReactNode;
  tutor: React.ReactNode;
};

const PANEL_IDS = ["instructions", "editor", "tutor"];

const safeStorage = {
  getItem: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
};

export function DesktopWorkspaceLayout({ instructions, editor, tutor }: DesktopWorkspaceLayoutProps) {
  const layout = useDefaultLayout({ id: "pace-workspace-columns", panelIds: PANEL_IDS, storage: safeStorage });

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      id="pace-workspace-columns"
      defaultLayout={layout.defaultLayout}
      onLayoutChanged={layout.onLayoutChanged}
      className="min-h-0 flex-1"
    >
      <ResizablePanel id="instructions" defaultSize="24" minSize="15" maxSize="40">
        {instructions}
      </ResizablePanel>
      <WorkspaceResizeHandle />
      <ResizablePanel id="editor" defaultSize="50" minSize="28">
        {editor}
      </ResizablePanel>
      <WorkspaceResizeHandle />
      <ResizablePanel id="tutor" defaultSize="26" minSize="18" maxSize="42">
        {tutor}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
