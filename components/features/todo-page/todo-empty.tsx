import type { TodoTab } from "./group-todos";

const MESSAGES: Record<TodoTab, string> = {
  assigned: "You're all caught up.",
  missing: "Nothing is missing.",
  done: "Nothing handed in yet.",
};

export function TodoEmpty({ tab }: { tab: TodoTab }) {
  return <p className="py-12 text-center text-[13px] leading-normal text-pace-muted">{MESSAGES[tab]}</p>;
}
