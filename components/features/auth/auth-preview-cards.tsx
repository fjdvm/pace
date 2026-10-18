import { AuthIcon } from "./auth-icon";
import { HeartsMeter } from "./hearts-meter";

const cardClass =
  "rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_4px_0_0_var(--color-pace-line)]";

export function AuthPreviewCards() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className={`${cardClass} flex items-center gap-3 px-[18px] py-3.5`}>
        <AuthIcon name="check-green-18" size={18} />
        <p className="flex-1 text-[15px] font-semibold leading-[1.55] text-pace-ink">
          3 of 3 tests passed
        </p>
        <span className="rounded-full bg-pace-amber-tint px-2.5 py-1 text-xs font-bold leading-normal text-pace-ink">
          +50 XP
        </span>
      </div>
      <div className={`${cardClass} flex flex-col gap-2 px-[18px] py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AuthIcon name="sparkles" size={16} />
            <p className="text-base font-bold leading-[1.35] tracking-[-0.08px] text-pace-ink">
              PACE Tutor
            </p>
          </div>
          <HeartsMeter />
        </div>
        <p className="text-[13px] leading-normal text-pace-ink-2">
          Before I hint: what do you expect line 3 to print?
        </p>
      </div>
    </div>
  );
}
