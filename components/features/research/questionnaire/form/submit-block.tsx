import { Button3D } from "../shared/button-3d";

type Props = { hint: string; label: string; ready: boolean; isSubmitting: boolean; onSubmit: () => void };

export function SubmitBlock({ hint, label, ready, isSubmitting, onSubmit }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 pt-4">
      <p className="text-center text-sm text-lp-muted">{hint}</p>
      <Button3D disabled={!ready || isSubmitting} onClick={onSubmit}>
        {isSubmitting ? "Saving…" : label}
      </Button3D>
    </div>
  );
}
