import Link from "next/link";
import Image from "next/image";

type WorkRowProps = {
  href: string;
  title: string;
  meta: string;
  menu: React.ReactNode;
};

export function WorkRow({ href, title, meta, menu }: WorkRowProps) {
  return (
    <div className="relative flex h-16 items-center gap-4 border-b border-pace-line pl-4 pr-2">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
        <Image src="/class/assignment.svg" alt="" width={24} height={24} />
      </span>
      <Link href={href} className="min-w-0 flex-1 truncate text-[15px] font-bold leading-[1.55] text-pace-ink after:absolute after:inset-0 after:content-['']">
        {title}
      </Link>
      <span className="shrink-0 whitespace-nowrap text-[13px] leading-normal text-pace-muted">{meta}</span>
      {menu}
    </div>
  );
}
