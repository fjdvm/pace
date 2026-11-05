import type { ReactNode } from "react";
import Image from "next/image";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useDashboardSession } from "@/components/features/dashboard/dashboard-session";
import { TopBar } from "@/components/features/dashboard/top-bar/top-bar";
import {
  ClassTitleProvider,
  SetClassTitle,
} from "@/components/features/dashboard/top-bar/class-title-context";
import { itemKindLabel } from "@/lib/items/presentation";
import { PostItemSidebar } from "./post-item-sidebar";
import type { useWorkspace } from "./use-workspace";

type Props = {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
  className: string;
  classId: string;
  onBack: () => void;
  children: ReactNode;
  overview?: boolean;
};
export function PostWorkspaceFrame({
  ws,
  title,
  className,
  classId,
  onBack,
  children,
  overview,
}: Props) {
  const session = useDashboardSession();
  const index = ws.items.findIndex((item) => item.id === ws.activeId);
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "280px" } as React.CSSProperties}
      className="min-h-0! flex-1 flex-col overflow-hidden"
    >
      <div className="hidden lg:block">
        <ClassTitleProvider>
          <SetClassTitle id={classId} name={className} />
          {session && <TopBar {...session} />}
        </ClassTitleProvider>
      </div>
      <header className="flex h-[54px] shrink-0 items-center gap-2 border-b border-pace-line pl-1 pr-4 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label={overview ? "Back to Class" : "Back to Overview"}
        >
          <Image
            src="/student/workspace/back.svg"
            alt=""
            width={24}
            height={24}
          />
        </Button>
        <div className="min-w-0 flex-1">
          <b className="block truncate text-base">
            {overview ? title : `Item ${index + 1} of ${ws.items.length}`}
          </b>
          <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
            {overview
              ? `Due ${new Date(ws.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${ws.items.reduce((n, i) => n + i.points, 0)} pts`
              : `${itemKindLabel(ws.activeItem.kind)} · ${ws.activeItem.points} pts`}
          </p>
        </div>
        {overview && (
          <span className="rounded-full bg-pace-amber-tint px-2.5 py-1 text-xs font-bold">
            {ws.done}/{ws.items.length}
          </span>
        )}
      </header>
      <div className="flex min-h-0 flex-1">
        {!overview && (
          <Sidebar className="top-16 hidden h-[calc(100dvh-64px)] border-r border-pace-line lg:flex [&_[data-slot=sidebar-inner]]:gap-1 [&_[data-slot=sidebar-inner]]:bg-pace-canvas [&_[data-slot=sidebar-inner]]:px-3 [&_[data-slot=sidebar-inner]]:pt-4">
            <PostItemSidebar ws={ws} title={title} />
          </Sidebar>
        )}
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}
