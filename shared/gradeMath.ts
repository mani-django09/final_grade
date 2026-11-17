/**
 * Weighted-grade math shared by the tRPC router and the browser.
 *
 * The client calls these directly so results (and the what-if slider) are
 * instant; the server keeps exposing them over tRPC for API consumers. Both
 * import from here so the two can never drift apart.
 */

export interface FinalGradeResult {
  /** Score needed on the final, rounded to 2dp. Can exceed 100 or go negative. */
  requiredGrade: number;
  isAchievable: boolean;
  message: string;
}

const NOT_ACHIEVABLE = "The desired grade is not achievable with the current grade and final exam weight.";
const ALREADY_ACHIEVED = "You have already achieved your desired grade!";

/** Score needed on the final exam to finish the course at `desiredGrade`. */
export function calculateFinalGrade(
  currentGrade: number,
  finalExamWeight: number,
  desiredGrade: number
): FinalGradeResult {
  // With no weight on the final, the exam can't move the course grade at all.
  if (finalExamWeight === 0) {
    const achieved = currentGrade >= desiredGrade;
    return {
      requiredGrade: desiredGrade,
      isAchievable: achieved,
      message: achieved ? ALREADY_ACHIEVED : NOT_ACHIEVABLE,
    };
  }

  const currentWeight = 100 - finalExamWeight;
  const required = (desiredGrade - (currentGrade * currentWeight / 100)) / (finalExamWeight / 100);
  const rounded = Math.round(required * 100) / 100;

  return {
    requiredGrade: rounded,
    // Judged on the exact value, not the rounded one.
    isAchievable: required <= 100 && required >= 0,
    message:
      required > 100 ? NOT_ACHIEVABLE
      : required < 0 ? ALREADY_ACHIEVED
      : `You need a ${rounded}% on the final exam to achieve your desired grade.`,
  };
}

/**
 * The inverse of the above: the course grade you'd finish with if you scored
 * `examScore` on the final. Powers the what-if slider.
 */
export function projectCourseGrade(
  currentGrade: number,
  finalExamWeight: number,
  examScore: number
): number {
  const currentWeight = 100 - finalExamWeight;
  const projected = (currentGrade * currentWeight + examScore * finalExamWeight) / 100;
  return Math.round(projected * 100) / 100;
}

/** US letter grade for a percentage, matching the scale used across the site. */
export function letterForPercentage(pct: number): string {
  if (pct >= 93) return "A";
  if (pct >= 90) return "A-";
  if (pct >= 87) return "B+";
  if (pct >= 83) return "B";
  if (pct >= 80) return "B-";
  if (pct >= 77) return "C+";
  if (pct >= 73) return "C";
  if (pct >= 70) return "C-";
  if (pct >= 67) return "D+";
  if (pct >= 63) return "D";
  if (pct >= 60) return "D-";
  return "F";
}

/* ── Single test scoring ──────────────────────────────────── */

export interface TestScore {
  percentage: number;
  letter: string;
  correct: number;
  wrong: number;
}

/**
 * Score for one test given how many questions were missed.
 *
 * `wrong` is clamped into 0..total so a stray keystroke can't produce a
 * negative score or one above 100.
 */
export function scoreFromQuestions(total: number, wrong: number): TestScore {
  if (total <= 0) {
    return { percentage: 0, letter: "F", correct: 0, wrong: 0 };
  }
  const missed = Math.min(Math.max(wrong, 0), total);
  const correct = total - missed;
  const percentage = Math.round((correct / total) * 10000) / 100;
  return { percentage, letter: letterForPercentage(percentage), correct, wrong: missed };
}

/**
 * Score from raw points, e.g. 43 marks out of 50.
 *
 * Earned points above the maximum are kept rather than clamped — extra credit
 * legitimately pushes a test above 100%.
 */
export function scoreFromPoints(earned: number, total: number): TestScore {
  if (total <= 0) {
    return { percentage: 0, letter: "F", correct: 0, wrong: 0 };
  }
  const got = Math.max(earned, 0);
  const percentage = Math.round((got / total) * 10000) / 100;
  return {
    percentage,
    letter: letterForPercentage(percentage),
    correct: got,
    wrong: Math.max(total - got, 0),
  };
}

export interface ChartRow {
  wrong: number;
  correct: number;
  percentage: number;
  letter: string;
}

/**
 * Every possible outcome for a test of `total` questions — the grading chart
 * teachers use to mark a stack of papers without recomputing each one.
 *
 * Above `maxRows` entries the chart steps through evenly instead of listing
 * every value, so a 500-question exam stays readable and doesn't bloat the DOM.
 */
export function buildGradingChart(total: number, maxRows = 101): ChartRow[] {
  if (total <= 0) return [];

  const rowCount = total + 1; // 0 wrong through all wrong
  const step = rowCount <= maxRows ? 1 : Math.ceil(rowCount / maxRows);

  const rows: ChartRow[] = [];
  for (let wrong = 0; wrong <= total; wrong += step) {
    const { percentage, letter, correct } = scoreFromQuestions(total, wrong);
    rows.push({ wrong, correct, percentage, letter });
  }

  // Stepping can skip the final row; the all-wrong case is worth showing.
  if (rows[rows.length - 1]?.wrong !== total) {
    const { percentage, letter, correct } = scoreFromQuestions(total, total);
    rows.push({ wrong: total, correct, percentage, letter });
  }

  return rows;
}

/* ── GPA ──────────────────────────────────────────────────── */

/** Standard US 4.0 scale. A+ and A both land on 4.0, as most registrars treat them. */
export const GRADE_POINTS: Readonly<Record<string, number>> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0,
};

export const GRADE_OPTIONS = Object.keys(GRADE_POINTS);

export type CourseLevel = "regular" | "honors" | "ap";

/** Extra grade points a weighted scale awards for harder course levels. */
export const LEVEL_BONUS: Readonly<Record<CourseLevel, number>> = {
  regular: 0,
  honors: 0.5,
  ap: 1.0,
};

export const LEVEL_LABELS: Readonly<Record<CourseLevel, string>> = {
  regular: "Regular",
  honors: "Honors",
  ap: "AP / IB",
};

export interface GpaCourse {
  grade: string;
  credits: number;
  level?: CourseLevel;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  /** Sum of grade points x credits — what registrars call quality points. */
  qualityPoints: number;
  /** Courses that actually counted (a grade selected and credits above zero). */
  countedCourses: number;
}

/**
 * Grade points for one course, including the weighted bonus when asked for.
 * `bonuses` lets a school's own weighting (e.g. +1.0 for Honors) replace the
 * common +0.5 / +1.0 default.
 */
export function gradePointsFor(
  grade: string,
  level: CourseLevel = "regular",
  weighted = false,
  bonuses: Readonly<Record<CourseLevel, number>> = LEVEL_BONUS
): number {
  const base = GRADE_POINTS[grade];
  if (base === undefined) return 0;
  // A failing grade earns nothing, so no scale bumps it above zero.
  if (!weighted || base === 0) return base;
  return base + bonuses[level];
}

/**
 * GPA across any number of courses.
 *
 * Rows without a grade or without positive credits are skipped, so a
 * part-filled form still reports the GPA of what's been entered.
 */
export function calculateGpa(
  courses: ReadonlyArray<GpaCourse>,
  weighted = false,
  bonuses: Readonly<Record<CourseLevel, number>> = LEVEL_BONUS
): GpaResult {
  const valid = courses.filter(c => c.grade in GRADE_POINTS && c.credits > 0);

  if (valid.length === 0) {
    return { gpa: 0, totalCredits: 0, qualityPoints: 0, countedCourses: 0 };
  }

  const totalCredits = valid.reduce((sum, c) => sum + c.credits, 0);
  const qualityPoints = valid.reduce(
    (sum, c) => sum + gradePointsFor(c.grade, c.level ?? "regular", weighted, bonuses) * c.credits,
    0
  );

  return {
    gpa: Math.round((qualityPoints / totalCredits) * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
    qualityPoints: Math.round(qualityPoints * 100) / 100,
    countedCourses: valid.length,
  };
}

/**
 * Rolls this term into an existing transcript.
 *
 * `priorGpa` and `priorCredits` come off the student's record; the result is
 * the cumulative GPA once this term's quality points are added in.
 */
export function calculateCumulativeGpa(
  priorGpa: number,
  priorCredits: number,
  term: GpaResult
): { gpa: number; totalCredits: number } {
  const totalCredits = priorCredits + term.totalCredits;
  if (totalCredits <= 0) return { gpa: 0, totalCredits: 0 };

  const totalPoints = priorGpa * priorCredits + term.qualityPoints;
  return {
    gpa: Math.round((totalPoints / totalCredits) * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
  };
}

export interface TermGpa {
  gpa: number;
  credits: number;
}

/**
 * Cumulative GPA from a list of term (semester) GPAs, each weighted by the
 * credits it carried. Terms with no credits or no GPA entered are skipped.
 */
export function combineTermGpas(terms: ReadonlyArray<TermGpa>): { gpa: number; totalCredits: number; qualityPoints: number; countedTerms: number } {
  const valid = terms.filter(t => t.credits > 0 && t.gpa >= 0 && Number.isFinite(t.gpa));
  const totalCredits = valid.reduce((s, t) => s + t.credits, 0);
  if (totalCredits <= 0) return { gpa: 0, totalCredits: 0, qualityPoints: 0, countedTerms: 0 };
  const qualityPoints = valid.reduce((s, t) => s + t.gpa * t.credits, 0);
  return {
    gpa: Math.round((qualityPoints / totalCredits) * 100) / 100,
    totalCredits: Math.round(totalCredits * 100) / 100,
    qualityPoints: Math.round(qualityPoints * 100) / 100,
    countedTerms: valid.length,
  };
}

/**
 * GPA a student must average over `remainingCredits` to finish with
 * `targetGpa` cumulative. Can come out above the scale (unreachable) or
 * below zero (already locked in).
 */
export function gpaNeededForTarget(
  currentGpa: number,
  currentCredits: number,
  targetGpa: number,
  remainingCredits: number
): number {
  if (remainingCredits <= 0) return NaN;
  const needed = (targetGpa * (currentCredits + remainingCredits) - currentGpa * currentCredits) / remainingCredits;
  return Math.round(needed * 100) / 100;
}

/** Closest letter grade for a 4.0-scale GPA, for display next to the number. */
export function letterForGpa(gpa: number): string {
  if (gpa >= 3.85) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.15) return "B+";
  if (gpa >= 2.85) return "B";
  if (gpa >= 2.5) return "B-";
  if (gpa >= 2.15) return "C+";
  if (gpa >= 1.85) return "C";
  if (gpa >= 1.5) return "C-";
  if (gpa >= 1.15) return "D+";
  if (gpa >= 0.85) return "D";
  if (gpa >= 0.5) return "D-";
  return "F";
}

export interface OverallGradeResult {
  overallGrade: number;
  weightedSum: number;
  totalWeight: number;
}

/** Weighted average across any number of graded items. */
export function calculateOverallGrade(
  grades: ReadonlyArray<{ grade: number; weight: number }>
): OverallGradeResult {
  if (grades.length === 0) {
    return { overallGrade: 0, weightedSum: 0, totalWeight: 0 };
  }

  const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
  const weightedSum = grades.reduce((sum, g) => sum + g.grade * g.weight, 0);
  const overallGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;

  return {
    overallGrade: Math.round(overallGrade * 100) / 100,
    weightedSum: Math.round(weightedSum * 100) / 100,
    totalWeight: Math.round(totalWeight * 100) / 100,
  };
}
