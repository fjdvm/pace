import type { StudentAssignment } from "@/components/features/student/types";
import { TodoRow } from "./todo-row";

type TodoGroupProps = {
  title?: string;
  assignments: StudentAssignment[];
};

export function TodoGroup({ title, assignments }: TodoGroupProps) {
  if (assignments.length === 0) return null;
  return (
    <section>
      {title && (
        <div className="flex items-start justify-between border-b border-pace-line pb-2.5 pl-1 pr-2 pt-6">
          <h2 className="text-base font-bold leading-[1.35] tracking-[-0.005em] text-pace-ink">{title}</h2>
          <span className="text-[13px] leading-normal text-pace-muted">{assignments.length}</span>
        </div>
      )}
      <ul>
        {assignments.map((assignment) => (
          <TodoRow key={assignment.id} assignment={assignment} />
        ))}
      </ul>
    </section>
  );
}
