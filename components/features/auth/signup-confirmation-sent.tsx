import { AuthIcon } from "./auth-icon";
import { AuthFormHeading } from "./auth-form-heading";

export function SignupConfirmationSent({ email }: { email: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex size-8 items-center justify-center rounded-full bg-pace-sunken">
        <AuthIcon name="mail" size={16} />
      </div>
      <AuthFormHeading
        title="Check your inbox"
        subtitle={`We sent a confirmation link to ${email}. Click it to verify your account, then come back and log in.`}
      />
    </div>
  );
}
