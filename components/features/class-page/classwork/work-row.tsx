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
    <div className="relative grid min-h-16 grid-cols-[40px_minmax(0,1fr)_40px] items-center gap-x-3 gap-y-0 py-2 sm:flex sm:h-16 sm:gap-4 sm:py-0 border-b border-pace-line pl-4 pr-2">
      <span className="row-span-2 flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
        <Image src="/class/assignment.svg" alt="" width={24} height={24} />
      </span>
      <Link href={href} className="min-w-0 flex-1 truncate text-[15px] font-bold leading-[1.55] text-pace-ink after:absolute after:inset-0 after:content-['']">
        {title}
      </Link>
      <span className="col-start-2 row-start-2 shrink-0 whitespace-nowrap text-[13px] leading-normal text-pace-muted">{meta}</span>
      <div className="col-start-3 row-span-2 row-start-1">{menu}</div>
    </div>
  );
}
