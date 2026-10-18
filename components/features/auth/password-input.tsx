"use client";

import { useState } from "react";
import { AuthField } from "./auth-field";
import { AuthIcon } from "./auth-icon";

type PasswordInputProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  showToggle?: boolean;
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

export function PasswordInput({
  label = "Password",
  value,
  onChange,
  disabled,
  required,
  placeholder = "••••••••",
  showToggle = false,
  aside,
  children,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <AuthField
        label={label}
        type={isVisible ? "text" : "password"}
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
      />
      {(showToggle || aside) && (
        <div className="flex items-start justify-between">
          {showToggle ? (
            <button
              type="button"
              onClick={() => setIsVisible((prev) => !prev)}
              disabled={disabled}
              aria-pressed={isVisible}
              className="flex cursor-pointer items-center gap-1.5 text-[13px] leading-normal text-pace-ink-2 disabled:opacity-50"
            >
              <AuthIcon name="eye" size={16} />
              {isVisible ? "Hide password" : "Show password"}
            </button>
          ) : (
            <span />
          )}
          {aside}
        </div>
      )}
      {children}
    </div>
  );
}
