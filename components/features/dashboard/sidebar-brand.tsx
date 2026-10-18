import Image from "next/image";
import Link from "next/link";
import { Wordmark } from "@/components/features/landing/shared/wordmark";

export function SidebarBrand({ collapsed, className = "px-8" }: { collapsed: boolean; className?: string }) {
  if (collapsed) {
    return (
      <Link href="/" aria-label="Pace" className="flex justify-center">
        <Image src="/pace-mark.svg" alt="Pace" width={32} height={32} priority />
      </Link>
    );
  }
  return <Wordmark className={className} />;
}
