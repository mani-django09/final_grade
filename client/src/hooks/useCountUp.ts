import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Eases a number towards `target` so results visibly tick up instead of
 * snapping. Returns the current in-between value.
 *
 * The first value is shown immediately — animating up from zero on mount would
 * read as a loading state rather than a change. Retargeting mid-flight eases
 * from wherever the previous run had reached, so fast typing stays smooth.
 *
 * Browsers pause requestAnimationFrame in hidden or backgrounded tabs, which
 * would otherwise strand the display on a stale mid-animation number. A settle
 * timer always lands the exact target, so the value is correct even when no
 * frame ever runs.
 */
export function useCountUp(target: number, duration = 450): number {
  const [value, setValue] = useState(target);
  // Mirrors `value` synchronously so a new run can start from the live number
  // without waiting for a re-render.
  const current = useRef(target);
  const frame = useRef<number | undefined>(undefined);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isFirst = useRef(true);

  useEffect(() => {
    const apply = (v: number) => {
      current.current = v;
      setValue(v);
    };

    if (isFirst.current) {
      isFirst.current = false;
      apply(target);
      return;
    }

    if (prefersReducedMotion() || duration <= 0) {
      apply(target);
      return;
    }

    const from = current.current;
    if (from === target) return;

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic: quick to move, gentle to settle.
      const eased = 1 - Math.pow(1 - t, 3);
      apply(from + (target - from) * eased);
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);

    // Guarantees the exact target even if no frame ever fires.
    settle.current = setTimeout(() => apply(target), duration + 80);

    return () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current);
      clearTimeout(settle.current);
    };
  }, [target, duration]);

  return value;
}
