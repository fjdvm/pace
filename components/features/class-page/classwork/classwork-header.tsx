import { PaceButton } from "@/components/features/student/shared/pace-button";

type ClassworkHeaderProps = {
  classId: string;
  joinCode: string;
  archived: boolean;
};

export function ClassworkHeader({ classId, joinCode, archived }: ClassworkHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-6">
      {archived ? (
        <span />
      ) : (
        <PaceButton href={`/dashboard/assignments/new?classId=${classId}`} variant="green">
          + Create
        </PaceButton>
      )}
      <p className="text-[13px] text-pace-ink">
        <span className="font-normal text-pace-ink-2">Class code </span>
        <span className="font-bold">{joinCode}</span>
      </p>
    </div>
  );
}
