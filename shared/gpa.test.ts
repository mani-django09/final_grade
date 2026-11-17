import { describe, expect, it } from "vitest";
import {
  calculateCumulativeGpa,
  calculateGpa,
  gradePointsFor,
  letterForGpa,
} from "./gradeMath";

describe("gradePointsFor", () => {
  it("maps letters onto the 4.0 scale", () => {
    expect(gradePointsFor("A")).toBe(4.0);
    expect(gradePointsFor("B+")).toBe(3.3);
    expect(gradePointsFor("C-")).toBe(1.7);
    expect(gradePointsFor("F")).toBe(0);
  });

  it("ignores course level when unweighted", () => {
    expect(gradePointsFor("A", "ap", false)).toBe(4.0);
    expect(gradePointsFor("A", "honors", false)).toBe(4.0);
  });

  it("adds the level bonus when weighted", () => {
    expect(gradePointsFor("A", "regular", true)).toBe(4.0);
    expect(gradePointsFor("A", "honors", true)).toBe(4.5);
    expect(gradePointsFor("A", "ap", true)).toBe(5.0);
    expect(gradePointsFor("B", "ap", true)).toBe(4.0);
  });

  it("never lifts a failing grade above zero, even in an AP class", () => {
    expect(gradePointsFor("F", "ap", true)).toBe(0);
  });

  it("returns 0 for an unknown grade", () => {
    expect(gradePointsFor("Z")).toBe(0);
  });
});

describe("calculateGpa", () => {
  it("returns zeroes for no courses", () => {
    expect(calculateGpa([])).toEqual({ gpa: 0, totalCredits: 0, qualityPoints: 0, countedCourses: 0 });
  });

  it("averages equal-credit courses", () => {
    // (4.0 + 3.0) * 3 credits = 21 quality points over 6 credits = 3.5
    const r = calculateGpa([
      { grade: "A", credits: 3 },
      { grade: "B", credits: 3 },
    ]);
    expect(r.gpa).toBe(3.5);
    expect(r.totalCredits).toBe(6);
    expect(r.qualityPoints).toBe(21);
    expect(r.countedCourses).toBe(2);
  });

  it("weights by credit hours", () => {
    // A(4.0)x4 = 16, C(2.0)x1 = 2 → 18 / 5 = 3.6
    const r = calculateGpa([
      { grade: "A", credits: 4 },
      { grade: "C", credits: 1 },
    ]);
    expect(r.gpa).toBe(3.6);
    expect(r.totalCredits).toBe(5);
  });

  it("skips rows with no grade or no credits", () => {
    const r = calculateGpa([
      { grade: "A", credits: 3 },
      { grade: "", credits: 3 },
      { grade: "B", credits: 0 },
    ]);
    expect(r.countedCourses).toBe(1);
    expect(r.gpa).toBe(4.0);
    expect(r.totalCredits).toBe(3);
  });

  it("applies level bonuses on a weighted scale", () => {
    // A regular 4.0x3=12, A honors 4.5x3=13.5, A AP 5.0x3=15 → 40.5 / 9 = 4.5
    const courses = [
      { grade: "A", credits: 3, level: "regular" as const },
      { grade: "A", credits: 3, level: "honors" as const },
      { grade: "A", credits: 3, level: "ap" as const },
    ];
    expect(calculateGpa(courses, true).gpa).toBe(4.5);
    // Same courses unweighted are a flat 4.0.
    expect(calculateGpa(courses, false).gpa).toBe(4.0);
  });

  it("handles a full failing term", () => {
    const r = calculateGpa([
      { grade: "F", credits: 3 },
      { grade: "F", credits: 3 },
    ]);
    expect(r.gpa).toBe(0);
    expect(r.totalCredits).toBe(6);
  });

  it("handles fractional credits", () => {
    // A(4.0)x1.5 = 6, B(3.0)x0.5 = 1.5 → 7.5 / 2 = 3.75
    const r = calculateGpa([
      { grade: "A", credits: 1.5 },
      { grade: "B", credits: 0.5 },
    ]);
    expect(r.gpa).toBe(3.75);
    expect(r.totalCredits).toBe(2);
  });
});

describe("calculateCumulativeGpa", () => {
  it("blends a new term into an existing transcript", () => {
    // Prior: 3.0 over 30 credits = 90 points.
    // Term: A(4.0)x3 + B(3.0)x3 = 21 points over 6 credits.
    // (90 + 21) / 36 = 3.083... → 3.08
    const term = calculateGpa([
      { grade: "A", credits: 3 },
      { grade: "B", credits: 3 },
    ]);
    const r = calculateCumulativeGpa(3.0, 30, term);
    expect(r.gpa).toBe(3.08);
    expect(r.totalCredits).toBe(36);
  });

  it("returns the term GPA when there is no prior history", () => {
    const term = calculateGpa([{ grade: "A", credits: 3 }]);
    expect(calculateCumulativeGpa(0, 0, term).gpa).toBe(4.0);
  });

  it("returns zero when there are no credits at all", () => {
    const empty = calculateGpa([]);
    expect(calculateCumulativeGpa(0, 0, empty)).toEqual({ gpa: 0, totalCredits: 0 });
  });

  it("leaves the prior GPA untouched when the term is empty", () => {
    const empty = calculateGpa([]);
    expect(calculateCumulativeGpa(3.5, 60, empty).gpa).toBe(3.5);
  });
});

describe("letterForGpa", () => {
  it("maps GPA back onto letters", () => {
    expect(letterForGpa(4.0)).toBe("A");
    expect(letterForGpa(3.7)).toBe("A-");
    expect(letterForGpa(3.0)).toBe("B");
    expect(letterForGpa(2.0)).toBe("C");
    expect(letterForGpa(0)).toBe("F");
  });
});

import { combineTermGpas, gpaNeededForTarget, LEVEL_BONUS } from "./gradeMath";

describe("custom weighting bonuses", () => {
  it("uses a school's own bonus values when given", () => {
    const bonuses = { regular: 0, honors: 1.0, ap: 1.0 };
    expect(gradePointsFor("A", "honors", true, bonuses)).toBe(5.0);
    expect(gradePointsFor("F", "honors", true, bonuses)).toBe(0);
  });

  it("defaults to the standard bonuses", () => {
    const courses = [{ grade: "A", credits: 1, level: "honors" as const }];
    expect(calculateGpa(courses, true).gpa).toBe(calculateGpa(courses, true, LEVEL_BONUS).gpa);
    expect(calculateGpa(courses, true, { regular: 0, honors: 1, ap: 1 }).gpa).toBe(5.0);
  });
});

describe("combineTermGpas", () => {
  it("weights each term by its credits", () => {
    const r = combineTermGpas([{ gpa: 3.0, credits: 15 }, { gpa: 4.0, credits: 5 }]);
    expect(r.gpa).toBe(3.25);
    expect(r.totalCredits).toBe(20);
    expect(r.countedTerms).toBe(2);
  });

  it("skips terms with no credits", () => {
    expect(combineTermGpas([{ gpa: 3.5, credits: 0 }]).gpa).toBe(0);
    expect(combineTermGpas([{ gpa: 3.5, credits: 12 }, { gpa: 2, credits: 0 }]).gpa).toBe(3.5);
  });
});

describe("gpaNeededForTarget", () => {
  it("finds the average needed on remaining credits", () => {
    // 3.0 over 60 credits, want 3.2 after 30 more: (3.2*90 - 180)/30 = 3.6
    expect(gpaNeededForTarget(3.0, 60, 3.2, 30)).toBe(3.6);
  });

  it("returns NaN with no remaining credits", () => {
    expect(gpaNeededForTarget(3.0, 60, 3.2, 0)).toBeNaN();
  });
});
