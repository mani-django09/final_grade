import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  grades: router({
    // Calculate required final exam grade
    calculateFinalGrade: publicProcedure
      .input(
        z.object({
          currentGrade: z.number().min(0).max(100),
          finalExamWeight: z.number().min(0).max(100),
          desiredGrade: z.number().min(0).max(100),
        })
      )
      .query(({ input }) => {
        const { currentGrade, finalExamWeight, desiredGrade } = input;
        
        // Handle edge case where final exam weight is 0
        if (finalExamWeight === 0) {
          const requiredGrade = desiredGrade;
          return {
            requiredGrade,
            isAchievable: currentGrade >= desiredGrade,
            message: currentGrade >= desiredGrade
              ? "You have already achieved your desired grade!"
              : "The desired grade is not achievable with the current grade and final exam weight.",
          };
        }
        
        // Formula: Required = (Desired - (Current × (100 - Weight))) / Weight
        const currentWeight = 100 - finalExamWeight;
        const requiredGrade = (desiredGrade - (currentGrade * currentWeight / 100)) / (finalExamWeight / 100);
        
        return {
          requiredGrade: Math.round(requiredGrade * 100) / 100,
          isAchievable: requiredGrade <= 100 && requiredGrade >= 0,
          message: requiredGrade > 100 
            ? "The desired grade is not achievable with the current grade and final exam weight."
            : requiredGrade < 0
            ? "You have already achieved your desired grade!"
            : `You need a ${Math.round(requiredGrade * 100) / 100}% on the final exam to achieve your desired grade.`,
        };
      }),

    // Calculate overall grade from multiple assignments
    calculateOverallGrade: publicProcedure
      .input(
        z.object({
          grades: z.array(
            z.object({
              grade: z.number().min(0).max(100),
              weight: z.number().min(0),
            })
          ),
        })
      )
      .query(({ input }) => {
        const { grades } = input;
        
        if (grades.length === 0) {
          return {
            overallGrade: 0,
            weightedSum: 0,
            totalWeight: 0,
          };
        }
        
        const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
        const weightedSum = grades.reduce((sum, g) => sum + (g.grade * g.weight), 0);
        const overallGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;
        
        return {
          overallGrade: Math.round(overallGrade * 100) / 100,
          weightedSum: Math.round(weightedSum * 100) / 100,
          totalWeight: Math.round(totalWeight * 100) / 100,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
