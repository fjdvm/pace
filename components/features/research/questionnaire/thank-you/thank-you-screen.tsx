import Link from "next/link";
import { button3dClass } from "../shared/button-3d";

const steps = [
  { title: "After Sitting 1", copy: "Use PACE in your one to three sessions, then come back to this page and choose Sitting 2." },
  {
    title: "After Sitting 2",
    copy: "You're done. Thank you for helping evaluate PACE. Your answers are confidential and used only for this study.",
  },
];

export function ThankYouScreen() {
  return (
    <>
      <div className="flex flex-col gap-3.5 rounded-[22px] border border-lp-line bg-white p-7">
        {steps.map(({ title, copy }) => (
          <div key={title} className="flex flex-col gap-3.5">
            <p className="text-[17px] font-semibold text-lp-ink">{title}</p>
            <p className="text-[15px] leading-[23px] text-lp-muted">{copy}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center pt-4">
        <Link href="/" className={button3dClass}>
          Back to home
        </Link>
      </div>
    </>
  );
}
