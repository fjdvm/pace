import { getPasswordRules } from "@/lib/password-rules";
import { AuthIcon } from "./auth-icon";

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Password requirements">
      {getPasswordRules(password).map(({ label, met }) => (
        <li
          key={label}
          className={`flex items-center gap-1 text-[13px] leading-normal ${
            met ? "text-pace-green-deep" : "text-pace-muted"
          }`}
        >
          <AuthIcon name={met ? "check-green-14" : "circle-14"} size={14} />
          {label}
        </li>
      ))}
    </ul>
  );
}
