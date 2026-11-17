import { describe, expect, it } from "vitest";
import { AP_EXAMS, estimateApScore } from "./apExams";

describe("AP exam data", () => {
  it("has section weights summing to 100 for every exam", () => {
    for (const exam of AP_EXAMS) {
      const total = exam.sections.reduce((s, x) => s + x.weight, 0);
      expect(Math.abs(total - 100), exam.name).toBeLessThan(0.1);
    }
  });

  it("has descending cutoffs and unique ids", () => {
    for (const exam of AP_EXAMS) {
      const [a, b, c, d] = exam.cutoffs;
      expect(a > b && b > c && c > d, exam.name).toBe(true);
    }
    expect(new Set(AP_EXAMS.map(e => e.id)).size).toBe(AP_EXAMS.length);
  });
});

describe("estimateApScore", () => {
  const calcAB = AP_EXAMS.find(e => e.id === "calculus-ab")!;

  it("gives a 5 for a perfect paper and a 1 for a blank one", () => {
    expect(estimateApScore(calcAB, [42, 9, 9, 9, 9, 9, 9])).toEqual({ composite: 100, score: 5, toNext: 0 });
    expect(estimateApScore(calcAB, []).score).toBe(1);
  });

  it("weights MCQ and FRQ sections", () => {
    // 21/42 MCQ = 25 pts, 27/54 FRQ = 25 pts → 50 composite → 4 (cutoff 49)
    const r = estimateApScore(calcAB, [21, 9, 9, 9, 0, 0, 0]);
    expect(r.composite).toBe(50);
    expect(r.score).toBe(4);
    expect(r.toNext).toBe(13);
  });

  it("clamps earned points and accepts max overrides", () => {
    expect(estimateApScore(calcAB, [99, 99, 99, 99, 99, 99, 99]).composite).toBe(100);
    // FRQ 1 marked out of 6 instead of 9: 6/6 earns its full share
    const r = estimateApScore(calcAB, [0, 6], [0, 6]);
    expect(r.composite).toBeCloseTo(50 / 6, 1);
  });
});
