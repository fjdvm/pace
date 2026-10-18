import { AuthIcon } from "@/components/features/auth/auth-icon";

type PendingStepProps = {
  icon: string;
  iconBg: string;
  title: string;
  detail: string;
};

export function PendingStep({ icon, iconBg, title, detail }: PendingStepProps) {
  return (
    <li className="flex items-center gap-3.5">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        <AuthIcon name={icon} size={16} />
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[15px] font-bold leading-[1.55] text-pace-ink">{title}</p>
        <p className="text-[13px] leading-normal text-pace-ink-2">{detail}</p>
      </div>
    </li>
  );
}
