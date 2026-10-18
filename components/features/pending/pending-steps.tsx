import { PendingStep } from "./pending-step";

export function PendingSteps({ email }: { email: string }) {
  return (
    <ul className="flex flex-col gap-4">
      <PendingStep icon="check-white" iconBg="bg-pace-green" title="Account created" detail={email} />
      <PendingStep
        icon="clock"
        iconBg="bg-pace-amber-tint"
        title="Admin review"
        detail="Usually within 1–2 school days"
      />
      <PendingStep
        icon="mail"
        iconBg="bg-pace-sunken"
        title="You get an email"
        detail="Then you can create your first class"
      />
    </ul>
  );
}
