import Image from "next/image";
import { cn } from "@/lib/utils";

type LandingIconProps = {
  name: string;
  size: number;
  width?: number;
  height?: number;
  className?: string;
};

export function LandingIcon({
  name,
  size,
  width = size,
  height = size,
  className,
}: LandingIconProps) {
  return (
    <Image
      src={`/landing/${name}.svg`}
      alt=""
      width={width}
      height={height}
      aria-hidden
      className={cn("shrink-0 max-w-none", className)}
    />
  );
}
