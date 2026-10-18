import { Code2, Lock, Sparkles } from "lucide-react";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceButton } from "@/components/features/student/shared/pace-button";
import type { StatusItem } from "@/lib/system-status";

const icons = { tutor: Sparkles, backup: Sparkles, execution: Code2, encryption: Lock };
const tones = { ok: "green", optional: "neutral", error: "red" } as const;

type SystemStatusCardProps = {
  items: StatusItem[];
  showManageKeys?: boolean;
};

export function SystemStatusCard({ items, showManageKeys = true }: SystemStatusCardProps) {
  return (
    <section className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <h2 className="text-[15px] font-bold text-pace-ink">System status</h2>
      {items.map((item) => {
        const Icon = icons[item.id];
        return (
          <div key={item.id} className="flex items-center gap-3 rounded-xl bg-pace-canvas px-3.5 py-3">
            <Icon className="size-4 shrink-0 text-pace-ink-2" />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs font-semibold text-pace-ink">{item.title}</span>
              <span className="text-xs text-pace-muted">{item.detail}</span>
            </div>
            <PaceTag tone={tones[item.state]} className="px-2.5 py-0.5 text-[11px]">
              {item.badge}
            </PaceTag>
          </div>
        );
      })}
      {showManageKeys && (
        <PaceButton href="/dashboard/admin/settings" variant="secondary" className="w-full">
          Manage API keys
        </PaceButton>
      )}
    </section>
  );
}
