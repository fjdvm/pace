import { cn } from "@/lib/utils";

const tones = {
  green: "bg-pace-green-tint text-pace-green-deep",
  purple: "bg-pace-purple-tint text-pace-purple",
  blue: "bg-pace-blue-tint text-pace-blue",
};

type InitialsAvatarProps = {
  name: string;
  tone?: keyof typeof tones;
  className?: string;
};

export function getInitials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function InitialsAvatar({ name, tone = "green", className }: InitialsAvatarProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
        tones[tone],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
