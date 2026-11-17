import { describe, expect, it } from "vitest";
import { buildGradingChart, scoreFromPoints, scoreFromQuestions } from "./gradeMath";

describe("scoreFromQuestions", () => {
  it("scores a typical test", () => {
    // 43 correct out of 50 = 86%
    const r = scoreFromQuestions(50, 7);
    expect(r.percentage).toBe(86);
    expect(r.correct).toBe(43);
    expect(r.letter).toBe("B");
  });

  it("gives 100% for a perfect paper", () => {
    const r = scoreFromQuestions(25, 0);
    expect(r.percentage).toBe(100);
    expect(r.letter).toBe("A");
  });

  it("gives 0% when everything is wrong", () => {
    const r = scoreFromQuestions(25, 25);
    expect(r.percentage).toBe(0);
    expect(r.letter).toBe("F");
  });

  it("rounds repeating decimals to 2dp", () => {
    // 2 of 3 correct = 66.666… → 66.67
    expect(scoreFromQuestions(3, 1).percentage).toBe(66.67);
  });

  it("clamps a wrong count above the total", () => {
    const r = scoreFromQuestions(20, 50);
    expect(r.percentage).toBe(0);
    expect(r.wrong).toBe(20);
    expect(r.correct).toBe(0);
  });

  it("clamps a negative wrong count", () => {
    const r = scoreFromQuestions(20, -5);
    expect(r.percentage).toBe(100);
    expect(r.wrong).toBe(0);
  });

  it("returns zeroes when there are no questions", () => {
    expect(scoreFromQuestions(0, 0)).toEqual({ percentage: 0, letter: "F", correct: 0, wrong: 0 });
  });
});

describe("scoreFromPoints", () => {
  it("scores raw marks", () => {
    const r = scoreFromPoints(43, 50);
    expect(r.percentage).toBe(86);
    expect(r.letter).toBe("B");
  });

  it("allows extra credit above 100%", () => {
    // Clamping here would quietly hide the bonus marks.
    const r = scoreFromPoints(55, 50);
    expect(r.percentage).toBe(110);
    expect(r.wrong).toBe(0);
  });

  it("handles fractional marks", () => {
    expect(scoreFromPoints(17.5, 20).percentage).toBe(87.5);
  });

  it("floors negative marks at zero", () => {
    expect(scoreFromPoints(-4, 20).percentage).toBe(0);
  });

  it("returns zeroes when the paper is worth nothing", () => {
    expect(scoreFromPoints(10, 0).percentage).toBe(0);
  });
});

describe("buildGradingChart", () => {
  it("lists every outcome for a small test", () => {
    const rows = buildGradingChart(10);
    expect(rows).toHaveLength(11); // 0 through 10 wrong
    expect(rows[0]).toEqual({ wrong: 0, correct: 10, percentage: 100, letter: "A" });
    expect(rows[10]).toEqual({ wrong: 10, correct: 0, percentage: 0, letter: "F" });
  });

  it("returns an empty chart for no questions", () => {
    expect(buildGradingChart(0)).toEqual([]);
  });

  it("steps through long tests instead of listing every row", () => {
    const rows = buildGradingChart(500);
    expect(rows.length).toBeLessThanOrEqual(102);
    expect(rows[0].wrong).toBe(0);
    // The all-wrong case must survive the stepping.
    expect(rows[rows.length - 1].wrong).toBe(500);
  });

  it("keeps consecutive rows when the test fits under the cap", () => {
    const rows = buildGradingChart(100);
    expect(rows).toHaveLength(101);
    expect(rows.map(r => r.wrong)).toEqual(Array.from({ length: 101 }, (_, i) => i));
  });

  it("scores each row consistently with scoreFromQuestions", () => {
    const rows = buildGradingChart(40);
    for (const row of rows) {
      expect(row.percentage).toBe(scoreFromQuestions(40, row.wrong).percentage);
      expect(row.letter).toBe(scoreFromQuestions(40, row.wrong).letter);
    }
  });
});
