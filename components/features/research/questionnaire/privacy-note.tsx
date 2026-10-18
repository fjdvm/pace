import { ShieldCheck } from "lucide-react";

export function PrivacyNote() {
  return (
    <div className="flex gap-3.5 rounded-2xl bg-pace-green-tint px-[22px] py-[18px]">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-pace-green-deep" />
      <p className="pace-body text-pace-ink">
        Your answers are confidential and used only for this study, under the Data Privacy Act of 2012 (RA 10173). You
        can stop at any time.
      </p>
    </div>
  );
}
