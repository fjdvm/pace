import { PaceIcon } from "@/components/features/student/shared/pace-icon";

export function TutorTipCard() {
  return (
    <section className="flex flex-col gap-2 rounded-[20px] bg-pace-purple-tint p-5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-pace-purple">
        <PaceIcon name="sparkles-purple" size={16} />
        Tutor tip
      </div>
      <p className="text-[13px] leading-normal text-pace-ink">
        Run your code before asking. The tutor reads your latest test results, so its first hint will be sharper.
      </p>
    </section>
  );
}
