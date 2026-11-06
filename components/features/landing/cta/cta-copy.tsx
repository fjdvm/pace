"use client";

import { motion } from "motion/react";
import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";
import { useMotionEnabled } from "../shared/use-motion-enabled";

export function CtaCopy() {
  const motionEnabled = useMotionEnabled();

  return (
    <motion.div
      initial={motionEnabled ? { opacity: 0, y: 24 } : false}
      whileInView={motionEnabled ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative flex flex-col items-center gap-8 px-6 text-center"
    >
      <h2 className="font-lp-serif text-[36px] font-medium leading-[normal] tracking-[-0.012em] text-white sm:text-[52px]">
        Take part in the evaluation
      </h2>
      <SignInLink className="flex h-12 w-full max-w-[318px] items-center justify-center rounded-full bg-white font-lp-sans text-base font-semibold text-[#111] shadow-[0_3px_0_0_rgba(0,0,0,0.2)] transition-[transform,box-shadow] duration-100 active:translate-y-[3px] active:shadow-[0_0_0_0_transparent]">
        Sign in with Google
      </SignInLink>
      <p className="font-lp-sans text-sm font-medium text-[#e5e5e5]">
        For students and instructors of the Polytechnic University of the Philippines
      </p>
    </motion.div>
  );
}
