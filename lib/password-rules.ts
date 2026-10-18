export interface PasswordRule {
  label: string;
  met: boolean;
}

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
  ];
}
