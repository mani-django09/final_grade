import { useEffect, useRef, useState } from "react";

/**
 * Returns a class name to hang a flash animation off, or "" when idle, so a
 * result can confirm it just updated.
 *
 * Live calculators recompute silently as you type; without a cue it's easy to
 * miss that the number moved. The class alternates between two names on
 * consecutive changes — re-applying the same class wouldn't restart the CSS
 * animation, so rapid edits would flash only once. Skips the initial render,
 * since nothing has changed at that point.
 *
 * Style both names identically, e.g.
 *   .result.flash-a, .result.flash-b { animation: pulse 0.65s ease-out; }
 */
export function useHighlightOnChange(value: unknown, ms = 650): string {
  const [cls, setCls] = useState("");
  const previous = useRef(value);
  const alternate = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (Object.is(previous.current, value)) return;
    previous.current = value;

    alternate.current = !alternate.current;
    setCls(alternate.current ? "flash-a" : "flash-b");

    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCls(""), ms);

    return () => clearTimeout(timer.current);
  }, [value, ms]);

  return cls;
}
