import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("grades.calculateFinalGrade", () => {
  it("calculates required final exam grade correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateFinalGrade({
      currentGrade: 85,
      finalExamWeight: 25,
      desiredGrade: 90,
    });

    // (90 - (85 * 0.75)) / 0.25 = (90 - 63.75) / 0.25 = 105
    expect(result.requiredGrade).toBe(105);
    expect(result.isAchievable).toBe(false);
  });

  it("returns achievable false when required grade exceeds 100", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateFinalGrade({
      currentGrade: 50,
      finalExamWeight: 25,
      desiredGrade: 90,
    });

    expect(result.requiredGrade).toBeGreaterThan(100);
    expect(result.isAchievable).toBe(false);
  });

  it("returns correct message when desired grade is achievable", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateFinalGrade({
      currentGrade: 95,
      finalExamWeight: 25,
      desiredGrade: 90,
    });

    // (90 - (95 * 0.75)) / 0.25 = (90 - 71.25) / 0.25 = 75
    // Since 75 is between 0 and 100, it is achievable
    expect(result.requiredGrade).toBe(75);
    expect(result.isAchievable).toBe(true);
  });

  it("handles edge case with 100% final exam weight", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateFinalGrade({
      currentGrade: 0,
      finalExamWeight: 100,
      desiredGrade: 85,
    });

    expect(result.requiredGrade).toBe(85);
    expect(result.isAchievable).toBe(true);
  });

  it("handles edge case with 0% final exam weight", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateFinalGrade({
      currentGrade: 85,
      finalExamWeight: 0,
      desiredGrade: 85,
    });

    expect(result.requiredGrade).toBe(85);
    expect(result.isAchievable).toBe(true);
  });
});

describe("grades.calculateOverallGrade", () => {
  it("calculates overall grade from single assignment", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 85, weight: 100 },
      ],
    });

    expect(result.overallGrade).toBe(85);
    expect(result.totalWeight).toBe(100);
  });

  it("calculates overall grade from multiple assignments with equal weight", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 80, weight: 25 },
        { grade: 90, weight: 25 },
        { grade: 85, weight: 25 },
        { grade: 95, weight: 25 },
      ],
    });

    expect(result.overallGrade).toBe(87.5);
    expect(result.totalWeight).toBe(100);
  });

  it("calculates overall grade with different weights", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 85, weight: 20 },
        { grade: 90, weight: 15 },
        { grade: 78, weight: 25 },
        { grade: 92, weight: 20 },
        { grade: 88, weight: 20 },
      ],
    });

    // (85*20 + 90*15 + 78*25 + 92*20 + 88*20) / 100 = 8610 / 100 = 86.1
    // Due to rounding to 2 decimal places: 86.10 rounds to 86
    expect(result.overallGrade).toBe(86);
    expect(result.totalWeight).toBe(100);
  });

  it("calculates overall grade with different weights more precisely", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 85, weight: 20 },
        { grade: 90, weight: 15 },
        { grade: 80, weight: 25 },
        { grade: 92, weight: 20 },
        { grade: 88, weight: 20 },
      ],
    });

    // (85*20 + 90*15 + 80*25 + 92*20 + 88*20) / 100 = 8650 / 100 = 86.5
    expect(result.overallGrade).toBe(86.5);
    expect(result.totalWeight).toBe(100);
  });

  it("handles empty grades array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [],
    });

    expect(result.overallGrade).toBe(0);
    expect(result.totalWeight).toBe(0);
  });

  it("handles grades with zero total weight", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 85, weight: 0 },
        { grade: 90, weight: 0 },
      ],
    });

    expect(result.overallGrade).toBe(0);
    expect(result.totalWeight).toBe(0);
  });

  it("calculates correctly with decimal weights", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 85, weight: 33.33 },
        { grade: 90, weight: 33.33 },
        { grade: 95, weight: 33.34 },
      ],
    });

    expect(result.overallGrade).toBeCloseTo(90, 1);
    expect(result.totalWeight).toBeCloseTo(100, 1);
  });

  it("handles perfect grades", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 100, weight: 50 },
        { grade: 100, weight: 50 },
      ],
    });

    expect(result.overallGrade).toBe(100);
  });

  it("handles failing grades", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.grades.calculateOverallGrade({
      grades: [
        { grade: 30, weight: 50 },
        { grade: 40, weight: 50 },
      ],
    });

    expect(result.overallGrade).toBe(35);
  });
});
