import { AuthField } from "./auth-field";
import { PasswordInput } from "./password-input";
import { PasswordChecklist } from "./password-checklist";

interface SignupFormFieldsProps {
  name: string;
  onNameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  password: string;
  onPasswordChange: (v: string) => void;
  isLoading: boolean;
}

export function SignupFormFields({
  name,
  onNameChange,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  isLoading,
}: SignupFormFieldsProps) {
  return (
    <>
      <AuthField
        label="Full name"
        value={name}
        onValueChange={onNameChange}
        disabled={isLoading}
        required
        autoComplete="name"
        placeholder="Ada Lovelace"
      />
      <AuthField
        label="School email"
        type="email"
        value={email}
        onValueChange={onEmailChange}
        disabled={isLoading}
        required
        autoComplete="email"
        placeholder="you@university.edu"
      />
      <PasswordInput value={password} onChange={onPasswordChange} disabled={isLoading} required>
        <PasswordChecklist password={password} />
      </PasswordInput>
    </>
  );
}
