import { Trophy } from "lucide-react";

export function NoEnrolledCard() {
  return (
    <div className="max-w-5xl w-full bg-white border border-surface-container rounded-3xl p-12 text-center flex flex-col items-center">
      <Trophy className="h-12 w-12 text-secondary/30 mb-4" />
      <h3 className="font-bold text-lg text-on-surface">No enrolled yet</h3>
    </div>
  );
}
