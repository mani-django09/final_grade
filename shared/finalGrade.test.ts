import { describe, expect, it } from "vitest";
import { calculateFinalGrade, projectCourseGrade } from "./gradeMath";

// Arguments are (current, finalWeight, target). Reference values cross-checked
// against other published final grade calculators (e.g. RogerHub).
describe("calculateFinalGrade matches reference calculators", () => {
  it("85% current, 25% target, 90% weight → 18.33%", () => {
    expect(calculateFinalGrade(85, 90, 25).requiredGrade).toBe(18.33);
  });

  it("58% current, 25% target, 90% weight → 21.33%", () => {
    expect(calculateFinalGrade(58, 90, 25).requiredGrade).toBe(21.33);
  });

  it("reports the exact figure above 100% instead of capping it", () => {
    const r = calculateFinalGrade(85, 25, 90);
    expect(r.requiredGrade).toBe(105);
    expect(r.isAchievable).toBe(false);
  });
});

describe("projectCourseGrade bounds", () => {
  it("gives the best and worst possible course grade", () => {
    // 58% current, final worth 90%
    expect(projectCourseGrade(58, 90, 100)).toBe(95.8);
    expect(projectCourseGrade(58, 90, 0)).toBe(5.8);
  });
});
