import { MobileItemMenu } from "./mobile-item-menu";
import type { WorkspaceItem } from "@/components/features/assignments/types";
import Image from "next/image";
import Link from "next/link";
import { formatDueSentence } from "@/lib/student-dates";
import type { AutosaveStatus } from "@/components/features/assignments/use-autosave";
import { SaveIndicator } from "./save-indicator";
import { WorkspaceActions } from "./workspace-actions";

type Props = {
  items: WorkspaceItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  title: string;
  itemTitle: string;
  itemIndex: number;
  itemCount: number;
  dueDate: string;
  backHref: string;
  autosaveStatus: AutosaveStatus;
  hearts: number;
  maxHearts: number;
  isSubmitted: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
};
export function WorkspaceTopBar(props: Props) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-pace-line bg-white pl-1 pr-4 lg:h-16 lg:gap-4 lg:pl-3 lg:pr-5">
      <Link
        href={props.backHref}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            props.onBack();
          }
        }}
        aria-label="Back to class"
        className="flex size-10 shrink-0 items-center justify-center rounded-full"
      >
        <Image
          src="/student/workspace/back.svg"
          alt=""
          width={24}
          height={24}
        />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold leading-[1.35] tracking-[-0.08px]">
          <span className="lg:hidden">
            <MobileItemMenu
              items={props.items}
              activeId={props.activeId}
              onSelect={props.onSelect}
              disabled={props.isRunning || props.isSubmitting}
            />
          </span>
          <span className="hidden lg:inline">{props.title}</span>
        </p>
        <div className="flex items-center gap-1 text-[11px] font-bold uppercase leading-[1.3] tracking-[0.66px] text-pace-muted lg:text-[13px] lg:font-normal lg:normal-case lg:leading-normal lg:tracking-normal">
          <span className="shrink-0">
            Item {props.itemIndex + 1} of {props.itemCount} ·
          </span>{" "}
          <span className="lg:hidden">
            <SaveIndicator
              status={props.autosaveStatus}
              isSubmitted={props.isSubmitted}
            />
          </span>
          <span className="hidden truncate lg:inline">
            {props.itemTitle} · {formatDueSentence(props.dueDate)}
          </span>
        </div>
      </div>
      <div className="hidden lg:block">
        <SaveIndicator
          status={props.autosaveStatus}
          isSubmitted={props.isSubmitted}
        />
      </div>
      <div className="flex items-center gap-2 rounded-[14px] bg-pace-red-tint px-2.5 py-[5px] text-[13px] font-bold text-pace-red lg:rounded-[16px] lg:px-3 lg:py-1.5">
        <span className="hidden lg:block">
          <span className="flex gap-1">
            {Array.from({ length: props.maxHearts }, (_, i) => (
              <Image
                key={i}
                src={
                  i < props.hearts
                    ? "/student/workspace/heart-full.svg"
                    : "/auth/heart-empty.svg"
                }
                alt=""
                width={18}
                height={18}
              />
            ))}
          </span>
        </span>
        <span className="lg:hidden">♥</span>
        <span className="lg:hidden">
          {props.hearts}/{props.maxHearts}
        </span>
        <span className="hidden lg:inline">
          {props.hearts} of {props.maxHearts}
        </span>
      </div>
      <div className="hidden items-center gap-4 lg:flex">
        <WorkspaceActions {...props} />
      </div>
    </header>
  );
}
