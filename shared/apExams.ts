/**
 * AP exam formats and score estimation.
 *
 * Section counts and weights follow College Board's AP Central exam pages for
 * the May 2027 exams (checked Nov 2026). Where a page doesn't state per-FRQ
 * points, `max` uses the long-standing scoring-guideline value and is marked
 * `typicalMax` so the UI can tell students to check it.
 *
 * College Board does NOT publish the composite cutoffs for each 1–5 score;
 * `cutoffs` are estimates (percent of the weighted composite) and must be
 * presented as such.
 */

export interface ApSection {
  label: string;
  /** Raw points available (MCQ = number of questions). */
  max: number;
  /** Share of the composite score, in percent. All sections sum to 100. */
  weight: number;
  kind: "mcq" | "frq";
  /** True when the exam page doesn't state this max and it's a typical value. */
  typicalMax?: boolean;
}

export interface ApExam {
  id: string;
  name: string;
  subject: "Math & CS" | "Science" | "History & Social Science" | "English";
  sections: ApSection[];
  /** Estimated minimum composite % for a 5, 4, 3 and 2. */
  cutoffs: [number, number, number, number];
}

const mcq = (n: number, weight: number): ApSection => ({ label: `Multiple choice (${n} questions)`, max: n, weight, kind: "mcq" });
const frq = (label: string, max: number, weight: number, typicalMax = false): ApSection => ({ label, max, weight, kind: "frq", typicalMax });
/** n equally weighted FRQs sharing `total` percent. */
const frqs = (n: number, max: number, total: number, typicalMax = true, prefix = "FRQ"): ApSection[] =>
  Array.from({ length: n }, (_, i) => frq(`${prefix} ${i + 1}`, max, total / n, typicalMax));

export const AP_EXAMS: ApExam[] = [
  { id: "calculus-ab", name: "AP Calculus AB", subject: "Math & CS", sections: [mcq(42, 50), ...frqs(6, 9, 50)], cutoffs: [63, 49, 36, 26] },
  { id: "calculus-bc", name: "AP Calculus BC", subject: "Math & CS", sections: [mcq(42, 50), ...frqs(6, 9, 50)], cutoffs: [62, 50, 40, 30] },
  {
    id: "precalculus", name: "AP Precalculus", subject: "Math & CS",
    sections: [
      { ...mcq(42, 62.5) },
      frq("FRQ 1 – Function concepts", 6, 9.375, true),
      frq("FRQ 2 – Modeling a non-periodic context", 6, 9.375, true),
      frq("FRQ 3 – Modeling a periodic context", 6, 9.375, true),
      frq("FRQ 4 – Symbolic manipulations", 6, 9.375, true),
    ],
    cutoffs: [70, 55, 40, 28],
  },
  {
    id: "statistics", name: "AP Statistics", subject: "Math & CS",
    sections: [
      mcq(42, 50),
      frq("FRQ 1 – Practices 1 & 2", 4, 12.5, true),
      frq("FRQ 2 – Practices 3 & 4", 4, 12.5, true),
      frq("FRQ 3 – Inference", 4, 12.5, true),
      frq("FRQ 4 – Practices 2, 3 & 4", 4, 12.5, true),
    ],
    cutoffs: [70, 57, 44, 32],
  },
  {
    id: "computer-science-a", name: "AP Computer Science A", subject: "Math & CS",
    sections: [
      mcq(42, 55),
      frq("FRQ 1 – Methods & control structures", 9, 11.25, true),
      frq("FRQ 2 – Class design", 9, 11.25, true),
      frq("FRQ 3 – Data analysis with ArrayList", 9, 11.25, true),
      frq("FRQ 4 – 2D array", 9, 11.25, true),
    ],
    cutoffs: [72, 58, 45, 32],
  },
  {
    id: "biology", name: "AP Biology", subject: "Science",
    sections: [
      mcq(60, 50),
      frq("Long FRQ 1", 9, 50 * 9 / 34), frq("Long FRQ 2", 9, 50 * 9 / 34),
      frq("Short FRQ 3", 4, 50 * 4 / 34), frq("Short FRQ 4", 4, 50 * 4 / 34),
      frq("Short FRQ 5", 4, 50 * 4 / 34), frq("Short FRQ 6", 4, 50 * 4 / 34),
    ],
    cutoffs: [66, 53, 40, 28],
  },
  {
    id: "chemistry", name: "AP Chemistry", subject: "Science",
    sections: [
      mcq(60, 50),
      frq("Long FRQ 1", 10, 50 * 10 / 46), frq("Long FRQ 2", 10, 50 * 10 / 46), frq("Long FRQ 3", 10, 50 * 10 / 46),
      frq("Short FRQ 4", 4, 50 * 4 / 46), frq("Short FRQ 5", 4, 50 * 4 / 46),
      frq("Short FRQ 6", 4, 50 * 4 / 46), frq("Short FRQ 7", 4, 50 * 4 / 46),
    ],
    cutoffs: [70, 55, 42, 30],
  },
  {
    id: "physics-1", name: "AP Physics 1", subject: "Science",
    sections: [
      mcq(42, 50),
      frq("FRQ 1 – Mathematical routines", 10, 50 * 10 / 40, true),
      frq("FRQ 2 – Translation between representations", 12, 50 * 12 / 40, true),
      frq("FRQ 3 – Experimental design & analysis", 10, 50 * 10 / 40, true),
      frq("FRQ 4 – Qualitative/quantitative translation", 8, 50 * 8 / 40, true),
    ],
    cutoffs: [64, 50, 37, 26],
  },
  {
    id: "environmental-science", name: "AP Environmental Science", subject: "Science",
    sections: [
      mcq(80, 60),
      frq("FRQ 1 – Design an investigation", 10, 40 / 3, true),
      frq("FRQ 2 – Analyze an environmental problem", 10, 40 / 3, true),
      frq("FRQ 3 – Problem with calculations", 10, 40 / 3, true),
    ],
    cutoffs: [68, 55, 43, 30],
  },
  {
    id: "psychology", name: "AP Psychology", subject: "History & Social Science",
    sections: [mcq(75, 66.7), frq("Article Analysis Question", 7, 16.65), frq("Evidence-Based Question", 7, 16.65)],
    cutoffs: [75, 63, 50, 37],
  },
  {
    id: "us-history", name: "AP US History", subject: "History & Social Science",
    sections: [
      mcq(55, 40),
      frq("Short answer 1", 3, 20 / 3, true), frq("Short answer 2", 3, 20 / 3, true), frq("Short answer 3", 3, 20 / 3, true),
      frq("Document-based question (DBQ)", 7, 25, true),
      frq("Long essay (LEQ)", 6, 15, true),
    ],
    cutoffs: [68, 56, 44, 32],
  },
  {
    id: "world-history", name: "AP World History: Modern", subject: "History & Social Science",
    sections: [
      mcq(55, 40),
      frq("Short answer 1", 3, 20 / 3, true), frq("Short answer 2", 3, 20 / 3, true), frq("Short answer 3", 3, 20 / 3, true),
      frq("Document-based question (DBQ)", 7, 25, true),
      frq("Long essay (LEQ)", 6, 15, true),
    ],
    cutoffs: [67, 55, 43, 31],
  },
  {
    id: "us-government", name: "AP US Government & Politics", subject: "History & Social Science",
    sections: [
      mcq(55, 50),
      frq("Concept application", 3, 12.5, true),
      frq("Quantitative analysis", 4, 12.5, true),
      frq("SCOTUS comparison", 4, 12.5, true),
      frq("Argument essay", 6, 12.5, true),
    ],
    cutoffs: [70, 57, 44, 32],
  },
  {
    id: "human-geography", name: "AP Human Geography", subject: "History & Social Science",
    sections: [mcq(60, 50), ...frqs(3, 7, 50)],
    cutoffs: [68, 57, 46, 33],
  },
  {
    id: "macroeconomics", name: "AP Macroeconomics", subject: "History & Social Science",
    sections: [mcq(60, 66.7), frq("Long FRQ", 10, 16.65, true), frq("Short FRQ 1", 5, 8.325, true), frq("Short FRQ 2", 5, 8.325, true)],
    cutoffs: [72, 58, 46, 35],
  },
  {
    id: "microeconomics", name: "AP Microeconomics", subject: "History & Social Science",
    sections: [mcq(60, 66.7), frq("Long FRQ", 10, 16.65, true), frq("Short FRQ 1", 5, 8.325, true), frq("Short FRQ 2", 5, 8.325, true)],
    cutoffs: [75, 61, 48, 36],
  },
  {
    id: "english-language", name: "AP English Language", subject: "English",
    sections: [mcq(45, 45), frq("Synthesis essay", 6, 55 / 3, true), frq("Rhetorical analysis essay", 6, 55 / 3, true), frq("Argument essay", 6, 55 / 3, true)],
    cutoffs: [70, 57, 44, 30],
  },
  {
    id: "english-literature", name: "AP English Literature", subject: "English",
    sections: [mcq(55, 45), frq("Poetry analysis essay", 6, 55 / 3, true), frq("Prose fiction analysis essay", 6, 55 / 3, true), frq("Literary argument essay", 6, 55 / 3, true)],
    cutoffs: [72, 58, 45, 30],
  },
];

export const AP_SCORE_MEANING: Record<number, string> = {
  5: "Extremely well qualified",
  4: "Very well qualified",
  3: "Qualified",
  2: "Possibly qualified",
  1: "No recommendation",
};

export interface ApEstimate {
  /** Weighted composite, 0–100. */
  composite: number;
  score: 1 | 2 | 3 | 4 | 5;
  /** Composite points still needed for the next score up (0 at a 5). */
  toNext: number;
}

/**
 * Estimated AP score. `earned[i]` and `max[i]` line up with `exam.sections`;
 * pass `max` to override a section's points total (scoring guidelines vary).
 * Earned points are clamped into 0..max.
 */
export function estimateApScore(exam: ApExam, earned: ReadonlyArray<number>, max?: ReadonlyArray<number>): ApEstimate {
  let composite = 0;
  exam.sections.forEach((s, i) => {
    const m = max?.[i] && max[i] > 0 ? max[i] : s.max;
    const e = Math.min(Math.max(earned[i] || 0, 0), m);
    composite += (e / m) * s.weight;
  });
  composite = Math.round(composite * 10) / 10;

  const [c5, c4, c3, c2] = exam.cutoffs;
  const score = composite >= c5 ? 5 : composite >= c4 ? 4 : composite >= c3 ? 3 : composite >= c2 ? 2 : 1;
  const next = score === 5 ? null : [c2, c3, c4, c5][score - 1];
  return { composite, score, toNext: next === null ? 0 : Math.round((next - composite) * 10) / 10 };
}
