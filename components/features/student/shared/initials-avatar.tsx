import { cn } from "@/lib/utils";

type InitialsAvatarProps = {
  name: string;
  className?: string;
};

export function getInitials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function InitialsAvatar({ name, className }: InitialsAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-pace-green-tint text-[13px] font-bold text-pace-green-deep",
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
