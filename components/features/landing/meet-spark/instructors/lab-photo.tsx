"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionEnabled } from "../../shared/use-motion-enabled";

export function LabPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const motionEnabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <motion.div
      ref={ref}
      data-lab-photo
      initial={motionEnabled ? { clipPath: "inset(0 100% 0 0)" } : false}
      whileInView={motionEnabled ? { clipPath: "inset(0 0% 0 0)" } : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="relative h-[280px] w-full max-w-[350px] overflow-clip rounded-[24px] border border-[#e3e1dc] xl:h-[385px] xl:max-w-[555px]"
    >
      <motion.div style={motionEnabled ? { y } : undefined} className="absolute -inset-y-6 inset-x-0">
        <Image
          src="/landing/photos/computer-lab.webp"
          alt="An instructor and students working on laptops together in a computer lab"
          fill
          sizes="(min-width: 1280px) 555px, 350px"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}
