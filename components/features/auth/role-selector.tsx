import { cn } from "@/lib/utils";
import { AuthIcon } from "./auth-icon";

export type AuthRole = "student" | "instructor";

interface RoleSelectorProps {
  role: AuthRole;
  isLoading: boolean;
  onRoleChange: (role: AuthRole) => void;
}

const ROLES: { value: AuthRole; label: string; description: string; icon: string }[] = [
  { value: "student", label: "Student", description: "Join classes, code, and ask the tutor", icon: "cap" },
  {
    value: "instructor",
    label: "Instructor",
    description: "Create classes and assignments. Needs admin approval",
    icon: "book",
  },
];

export function RoleSelector({ role, isLoading, onRoleChange }: RoleSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Account type" className="flex items-stretch gap-3">
      {ROLES.map((item) => {
        const selected = role === item.value;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={isLoading}
            onClick={() => onRoleChange(item.value)}
            className={cn(
              "flex min-w-0 flex-1 cursor-pointer flex-col gap-2 rounded-2xl p-4 text-left transition-colors disabled:opacity-60",
              selected
                ? "border-2 border-pace-green bg-pace-green-tint"
                : "border-[1.5px] border-pace-line-strong bg-white hover:border-pace-ink-2",
            )}
          >
            <span className="flex w-full items-center justify-between">
              <AuthIcon name={item.icon} size={22} />
              <AuthIcon name={selected ? "check-green-18" : "circle-18"} size={18} />
            </span>
            <span className="text-base font-bold leading-[1.35] tracking-[-0.08px] text-pace-ink">
              {item.label}
            </span>
            <span className="text-[13px] leading-normal text-pace-ink-2">{item.description}</span>
          </button>
        );
      })}
    </div>
  );
}
