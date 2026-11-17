import { COOKIE_NAME } from "@shared/const";
import { calculateFinalGrade, calculateOverallGrade } from "@shared/gradeMath";
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
      .query(({ input }) =>
        calculateFinalGrade(input.currentGrade, input.finalExamWeight, input.desiredGrade)
      ),

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
      .query(({ input }) => calculateOverallGrade(input.grades)),
  }),
});

export type AppRouter = typeof appRouter;
