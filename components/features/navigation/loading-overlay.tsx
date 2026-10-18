import { Heart } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/45 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative flex size-24 items-center justify-center">
        <span className="absolute inset-2 animate-ping rounded-full bg-pace-red/25" />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-white shadow-[0_4px_0_0_var(--color-pace-line)]">
          <Heart className="size-8 animate-pace-beat fill-pace-red text-pace-red" />
        </span>
      </div>
    </div>
  );
}
