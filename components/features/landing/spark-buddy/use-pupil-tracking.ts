"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { PUPIL_RANGE, pupilOffset } from "./pupil-offset";

const spring = { stiffness: 300, damping: 20 };
const LOOK_AROUND_MS = 1800;

export type Gaze = { x: number; y: number };

export function usePupilTracking(target: RefObject<Element | null>, active: boolean, gaze?: Gaze) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, spring);
  const y = useSpring(rawY, spring);
  const touching = useRef(false);
  const gazeX = gaze?.x;
  const gazeY = gaze?.y;

  useEffect(() => {
    if (!active) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    if (gazeX !== undefined && gazeY !== undefined) {
      rawX.set(gazeX);
      rawY.set(gazeY);
      return;
    }
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const lookAt = (clientX: number, clientY: number) => {
      const box = target.current?.getBoundingClientRect();
      if (!box) return;
      const o = pupilOffset(clientX - (box.left + box.width / 2), clientY - (box.top + box.height / 2));
      rawX.set(o.x);
      rawY.set(o.y);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        touching.current = true;
        lookAt(e.clientX, e.clientY);
      } else if (!coarse) {
        lookAt(e.clientX, e.clientY);
      }
    };
    const onEnd = () => {
      touching.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);

    const wander = coarse
      ? setInterval(() => {
          if (touching.current) return;
          const angle = Math.random() * Math.PI * 2;
          const reach = Math.random() * PUPIL_RANGE;
          rawX.set(Math.cos(angle) * reach);
          rawY.set(Math.sin(angle) * reach);
        }, LOOK_AROUND_MS)
      : undefined;

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      if (wander) clearInterval(wander);
    };
  }, [active, target, rawX, rawY, gazeX, gazeY]);

  return { x, y };
}
