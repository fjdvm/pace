import Image from "next/image";

type HeartsRowProps = {
  left: number;
  max: number;
};

export function HeartsRow({ left, max }: HeartsRowProps) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => (
        <Image
          key={i}
          src={i < left ? "/auth/heart-full.svg" : "/auth/heart-empty.svg"}
          alt=""
          width={18}
          height={18}
        />
      ))}
    </span>
  );
}
