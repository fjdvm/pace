import { Switch } from "@/components/ui/switch";

export function MonitoringSettings({ mobile = false }: { mobile?: boolean }) {
  const settings = [
    ["AI tutor", "Students can ask for hints inside the editor"],
    ...(!mobile
      ? [["Tiered hints", "Hints get more specific with each heart spent"]]
      : []),
    ["Activity monitoring", "Record typing, pasting, and tab switches"],
    ["Code similarity check", "Flag submissions with very similar structure"],
  ];
  return (
    <div className={mobile ? "flex flex-col gap-5" : "flex flex-col gap-4"}>
      {settings.map(([title, subtitle]) => (
        <div key={title} className="flex items-center justify-between gap-3">
          <div>
            <p className={mobile ? "text-[15px]" : "text-[15px] font-bold"}>
              {title}
            </p>
            {!mobile && (
              <p className="mt-0.5 text-[13px] leading-normal text-pace-muted">
                {subtitle}
              </p>
            )}
          </div>
          <Switch
            aria-label={`${title} is enabled for all Posts`}
            checked
            disabled
            className="data-[size=default]:h-6 data-[size=default]:w-10 shrink-0 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white data-checked:bg-pace-green data-disabled:opacity-100"
          />
        </div>
      ))}
      {!mobile && (
        <p className="text-[13px] leading-normal text-pace-muted">
          Students are told before they start that their activity is recorded.
        </p>
      )}
    </div>
  );
}
