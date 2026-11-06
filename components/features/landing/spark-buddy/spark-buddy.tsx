"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { usePauseOffScreen } from "../shared/use-pause-off-screen";
import { useMotionEnabled } from "../shared/use-motion-enabled";
import { sparkBuddyPaths as p } from "./spark-buddy-paths";
import { usePupilTracking, type Gaze } from "./use-pupil-tracking";
import { useBlink } from "./use-blink";

const center = { transformBox: "fill-box", transformOrigin: "center" } as const;
const loop = { repeat: Infinity, ease: "easeInOut", repeatType: "mirror" } as const;

export function SparkBuddy({ className, gaze }: { className?: string; gaze?: Gaze }) {
  const { ref, running } = usePauseOffScreen<HTMLDivElement>();
  const motionEnabled = useMotionEnabled();
  const squash = motionEnabled ? { scaleX: 1.06, scaleY: 0.94 } : { scaleX: 1, scaleY: 1 };
  const svgRef = useRef<SVGSVGElement>(null);
  const pupil = usePupilTracking(svgRef, running, gaze);
  const blink = useBlink(running);

  return (
    <div ref={ref} data-spark-buddy className={className}>
      <motion.div
        whileHover={squash}
        whileTap={squash}
        transition={{ type: "spring", stiffness: 400, damping: 18 }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 172.8 151.2"
          role="img"
          aria-label="Spark, the PACE pair programmer"
          className="block h-auto w-full overflow-visible"
        >
          <defs>
            <linearGradient id="spark-trail" x1="119.52" y1="50.4" x2="19.612" y2="164.581" gradientUnits="userSpaceOnUse">
              <stop stopColor="#D4F04A" stopOpacity="0.95" />
              <stop offset="0.4" stopColor="#E9F98A" stopOpacity="0.6" />
              <stop offset="1" stopColor="#FEFCE8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="spark-body" x1="63.6254" y1="31.9418" x2="155.853" y2="91.8353" gradientUnits="userSpaceOnUse">
              <stop stopColor="#16C75A" />
              <stop offset="0.55" stopColor="#4ADE80" />
              <stop offset="1" stopColor="#BEF264" />
            </linearGradient>
          </defs>
          <motion.path
            id="trail"
            d={p.trail}
            fill="url(#spark-trail)"
            style={center}
            animate={running ? { opacity: [0.6, 1], scaleX: [0.95, 1.05] } : { opacity: 1, scaleX: 1 }}
            transition={{ ...loop, duration: 1.4 }}
          />
          <motion.g
            style={center}
            animate={running ? { y: [-6, 6], rotate: [-3, 3] } : { y: 0, rotate: 0 }}
            transition={{ ...loop, duration: 2.8 }}
          >
            <path id="body" d={p.body} fill="url(#spark-body)" />
            <path id="shine" d={p.shine} opacity={0.35} fill="#fff" />
            <motion.g id="eye-left" style={{ ...center, scaleY: blink }}>
              <path d={p.eyeLeft} fill="#fff" />
              <motion.path id="pupil-left" d={p.pupilLeft} fill="#0F172A" style={{ x: pupil.x, y: pupil.y }} />
            </motion.g>
            <motion.g id="eye-right" style={{ ...center, scaleY: blink }}>
              <path d={p.eyeRight} fill="#fff" />
              <motion.path id="pupil-right" d={p.pupilRight} fill="#0F172A" style={{ x: pupil.x, y: pupil.y }} />
            </motion.g>
            <motion.path
              id="spark"
              d={p.spark}
              fill="#BEF264"
              style={center}
              animate={running ? { scale: [0.8, 1.2], rotate: [0, 90] } : { scale: 1, rotate: 0 }}
              transition={{ ...loop, duration: 1.2 }}
            />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
}
