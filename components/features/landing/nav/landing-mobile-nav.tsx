"use client";

import { useState } from "react";
import Link from "next/link";
import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import type { LandingAccount } from "@/lib/landing-account";
import { navLinks } from "./nav-links";

const startClass =
  "pace-press rounded-full bg-pace-green px-6 py-2.5 text-center text-sm font-semibold text-white shadow-[0_3px_0_var(--color-pace-green-deep)]";

export function LandingMobileNav({ homeHref = "", account }: { homeHref?: string; account: LandingAccount }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="text-pace-ink lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Open menu</span>
      </Button>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation and account links
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {navLinks.map((link) => (
            <SheetClose
              key={link.href}
              nativeButton={false}
              render={
                <a
                  href={`${homeHref}${link.href}`}
                  className="rounded-lg px-2 py-3 text-sm font-medium text-pace-ink hover:bg-pace-canvas"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-pace-line px-4 pt-4">
          <SheetClose
            nativeButton={false}
            render={
              account ? (
                <Link href={account.href} className={startClass} />
              ) : (
                <SignInLink className={startClass} />
              )
            }
          >
            {account ? account.label : "Start learning"}
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
