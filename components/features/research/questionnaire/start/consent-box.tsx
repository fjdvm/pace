"use client";

import { Checkbox } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";

export function ConsentBox({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#e9f7ef] p-[22px] text-lp-green-ink">
      <p className="text-[15px] font-semibold">Before you begin</p>
      <p className="text-[15px] leading-[23px]">
        Your answers are confidential and used only for this study, in line with the Data Privacy Act of 2012 (RA
        10173). Participation is voluntary, and you can stop at any time without penalty. No personally identifiable
        information appears in the findings.
      </p>
      <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-medium">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={onChange}
          className="flex size-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-lp-green-ink bg-white data-[checked]:bg-lp-green-ink data-[checked]:text-white"
        >
          <Checkbox.Indicator>
            <Check className="size-3.5" strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Root>
        I have read the informed consent form and agree to take part.
      </label>
    </div>
  );
}
