"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import type { StudyRole } from "@/lib/study/items/types";

const roles: { id: StudyRole; label: string }[] = [
  { id: "student", label: "A student" },
  { id: "instructor", label: "An instructor" },
];

export function RolePicker({ value, onChange }: { value: StudyRole; onChange: (role: StudyRole) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p id="role-label" className="text-[15px] font-semibold text-lp-ink">I am answering as</p>
      <RadioGroup
        aria-labelledby="role-label"
        value={value}
        onValueChange={(next) => onChange(next as StudyRole)}
        className="flex w-full flex-row gap-3"
      >
        {roles.map(({ id, label }) => (
          <Radio.Root
            key={id}
            value={id}
            className="pace-press flex flex-1 cursor-pointer items-start justify-center rounded-[16px] bg-white py-4 text-base font-semibold text-[#8a8a8a] shadow-[0_4px_0_0_#dbd9d4] data-[checked]:bg-[#2bc84e] data-[checked]:text-white data-[checked]:shadow-[0_4px_0_0_#178c33]"
          >
            {label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  );
}
