import { describe, expect, it } from "vitest";
import { estimateSatScore, estimateSectionScore } from "./satScore";

describe("estimateSectionScore", () => {
  it("gives 800 for a perfect section and 200 for a blank one", () => {
    expect(estimateSectionScore("math", 22, 22).score).toBe(800);
    expect(estimateSectionScore("rw", 0, 0).score).toBe(200);
  });

  it("lands near published approximate samples for the harder path", () => {
    // ~42/44 math ≈ 770-790, ~40/44 ≈ 740-770, ~50/54 R&W ≈ 750-780
    expect(estimateSectionScore("math", 21, 21).score).toBeGreaterThanOrEqual(770);
    expect(estimateSectionScore("math", 21, 21).score).toBeLessThanOrEqual(790);
    const m40 = estimateSectionScore("math", 20, 20).score;
    expect(m40).toBeGreaterThanOrEqual(740);
    expect(m40).toBeLessThanOrEqual(770);
    const rw50 = estimateSectionScore("rw", 25, 25).score;
    expect(rw50).toBeGreaterThanOrEqual(750);
    expect(rw50).toBeLessThanOrEqual(780);
  });

  it("routes automatically from Module 1 and caps the easier path", () => {
    expect(estimateSectionScore("math", 20, 20).path).toBe("harder");
    const easy = estimateSectionScore("math", 8, 22);
    expect(easy.path).toBe("easier");
    expect(easy.score).toBeLessThanOrEqual(700);
  });

  it("lets the user force a path, and the harder path never scores lower", () => {
    const hard = estimateSectionScore("rw", 15, 15, "harder");
    const easy = estimateSectionScore("rw", 15, 15, "easier");
    expect(hard.path).toBe("harder");
    expect(hard.score).toBeGreaterThanOrEqual(easy.score);
  });

  it("clamps out-of-range input and keeps the range within 200-800", () => {
    const r = estimateSectionScore("math", 99, -5);
    expect(r.correct).toBe(22);
    const top = estimateSectionScore("math", 22, 22);
    expect(top.high).toBe(800);
    expect(estimateSectionScore("rw", 0, 0).low).toBe(200);
  });

  it("is monotonic in correct answers", () => {
    let prev = 0;
    for (let c = 0; c <= 22; c++) {
      const s = estimateSectionScore("math", 22, c, "harder").score;
      expect(s).toBeGreaterThanOrEqual(prev);
      prev = s;
    }
  });
});

describe("estimateSatScore", () => {
  it("adds the two sections and their ranges", () => {
    const rw = estimateSectionScore("rw", 27, 27);
    const math = estimateSectionScore("math", 22, 22);
    const t = estimateSatScore(rw, math);
    expect(t.total).toBe(1600);
    expect(t.high).toBe(1600);
    expect(t.low).toBe(1540);
  });
});
