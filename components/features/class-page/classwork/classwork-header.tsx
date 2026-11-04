import { CreatePostMenu } from "./create-post-menu";

type ClassworkHeaderProps = {
  classId: string;
  joinCode: string;
  archived: boolean;
};

export function ClassworkHeader({ classId, joinCode, archived }: ClassworkHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-2">
      {archived ? (
        <span />
      ) : (
        <CreatePostMenu classId={classId} />
      )}
      <p className="whitespace-pre text-[13px] font-bold text-pace-ink-2">{`Class code  ${joinCode}`}</p>
    </div>
  );
}
