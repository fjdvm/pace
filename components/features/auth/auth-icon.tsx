import Image from "next/image";
import { cn } from "@/lib/utils";

type AuthIconProps = {
  name: string;
  size: number;
  className?: string;
};

export function AuthIcon({ name, size, className }: AuthIconProps) {
  return (
    <Image
      src={`/auth/${name}.svg`}
      alt=""
      width={size}
      height={size}
      aria-hidden
      className={cn("shrink-0 max-w-none", className)}
    />
  );
}
