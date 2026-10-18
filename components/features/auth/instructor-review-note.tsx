import { AuthIcon } from "./auth-icon";

export function InstructorReviewNote() {
  return (
    <div className="flex items-start gap-3 rounded-[14px] bg-pace-blue-tint px-4 py-3.5">
      <AuthIcon name="info" size={18} />
      <p className="flex-1 text-[13px] leading-normal text-pace-ink">
        Review usually takes 1–2 school days. We’ll email you once you can create your first class.
      </p>
    </div>
  );
}
