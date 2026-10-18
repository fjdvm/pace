import { AuthIcon } from "./auth-icon";

export function HeartsMeter({ full = 3, total = 5 }: { full?: number; total?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${full} of ${total} hearts`}>
      {Array.from({ length: total }, (_, i) => (
        <AuthIcon key={i} name={i < full ? "heart-full" : "heart-empty"} size={18} />
      ))}
    </div>
  );
}
