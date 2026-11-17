/**
 * Digital SAT score estimation.
 *
 * Format (College Board): Reading & Writing = 2 modules x 27 questions,
 * Math = 2 modules x 22 questions. Each section scores 200-800, total 400-1600.
 * Module 2 is easier or harder depending on Module 1 performance.
 *
 * College Board does NOT publish raw-to-scaled conversions (they come from
 * equating and differ by test form), so everything here is an ESTIMATE built
 * from approximate third-party conversion samples. The UI must present results
 * as a range, never as an official score.
 */

export type SatPath = "auto" | "harder" | "easier";
export type SatSectionId = "rw" | "math";

export const SAT_SECTIONS: Record<SatSectionId, { label: string; moduleQuestions: number }> = {
  rw: { label: "Reading & Writing", moduleQuestions: 27 },
  math: { label: "Math", moduleQuestions: 22 },
};

/** Anchors: [fraction of section answered correctly, estimated scaled score]. */
const HARDER: ReadonlyArray<[number, number]> = [
  [0, 200], [0.15, 330], [0.3, 440], [0.45, 550], [0.6, 640], [0.75, 710], [0.9, 760], [1, 800],
];
const EASIER: ReadonlyArray<[number, number]> = [
  [0, 200], [0.15, 300], [0.3, 390], [0.45, 480], [0.6, 560], [0.75, 620], [0.9, 670], [1, 700],
];

/** Fraction of Module 1 correct at or above which we assume the harder Module 2. */
export const HARDER_ROUTE_THRESHOLD = 0.6;
/** Half-width of the reported range, in scaled-score points, per section. */
export const SECTION_MARGIN = 30;

function interpolate(table: ReadonlyArray<[number, number]>, p: number): number {
  const x = Math.min(Math.max(p, 0), 1);
  for (let i = 1; i < table.length; i++) {
    const [x1, y1] = table[i];
    if (x <= x1) {
      const [x0, y0] = table[i - 1];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return table[table.length - 1][1];
}

const round10 = (n: number) => Math.round(n / 10) * 10;
const clampSection = (n: number) => Math.min(Math.max(n, 200), 800);

export interface SectionEstimate {
  score: number;
  low: number;
  high: number;
  correct: number;
  total: number;
  /** Which Module 2 the estimate assumed. */
  path: "harder" | "easier";
}

/** Estimated 200-800 score for one section from correct answers in each module. */
export function estimateSectionScore(
  section: SatSectionId,
  module1Correct: number,
  module2Correct: number,
  path: SatPath = "auto"
): SectionEstimate {
  const q = SAT_SECTIONS[section].moduleQuestions;
  const m1 = Math.min(Math.max(Math.round(module1Correct) || 0, 0), q);
  const m2 = Math.min(Math.max(Math.round(module2Correct) || 0, 0), q);
  const used: "harder" | "easier" = path === "auto" ? (m1 / q >= HARDER_ROUTE_THRESHOLD ? "harder" : "easier") : path;

  const fraction = (m1 + m2) / (q * 2);
  const score = clampSection(round10(interpolate(used === "harder" ? HARDER : EASIER, fraction)));
  return {
    score,
    low: clampSection(score - SECTION_MARGIN),
    high: clampSection(score + SECTION_MARGIN),
    correct: m1 + m2,
    total: q * 2,
    path: used,
  };
}

export interface SatEstimate {
  total: number;
  low: number;
  high: number;
  rw: SectionEstimate;
  math: SectionEstimate;
}

export function estimateSatScore(rw: SectionEstimate, math: SectionEstimate): SatEstimate {
  return {
    total: rw.score + math.score,
    low: rw.low + math.low,
    high: rw.high + math.high,
    rw,
    math,
  };
}
