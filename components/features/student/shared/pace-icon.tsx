import Image from "next/image";

type PaceIconProps = {
  name: string;
  size: number;
  className?: string;
};

export function PaceIcon({ name, size, className }: PaceIconProps) {
  return <Image src={`/student/${name}.svg`} alt="" width={size} height={size} className={className} />;
}
