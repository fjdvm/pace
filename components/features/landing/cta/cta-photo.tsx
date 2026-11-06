"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionEnabled } from "../shared/use-motion-enabled";

export function CtaPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <div ref={ref} data-cta-photo className="absolute inset-0 overflow-clip bg-[#3a3a3a]">
      <motion.div style={motionEnabled ? { y } : undefined} className="absolute -inset-y-8 inset-x-0">
        <Image
          src="/landing/photos/closing-cta.webp"
          alt="A Filipino college student working on code at a desk"
          fill
          sizes="100vw"
          className="object-cover object-right"
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/45" />
    </div>
  );
}
