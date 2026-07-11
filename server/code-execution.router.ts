import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { validateCodeInput } from "./security";
import { getDb } from "./db";
import { eq } from "drizzle-orm";
import { exercises, exerciseSubmissions } from "../drizzle/schema";

async function executeJavaScriptSafe(code: string): Promise<{
  success: boolean;
  output: string;
  error: string | null;
}> {
  const sanitizedCode = validateCodeInput(code);

  try {
    const vm = await import("vm");
    const logs: string[] = [];
    const context = vm.createContext({
      console: {
        log: (...args: unknown[]) => {
          logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" "));
        },
        error: (...args: unknown[]) => {
          logs.push("ERROR: " + args.map((a) => String(a)).join(" "));
        },
        warn: (...args: unknown[]) => {
          logs.push("WARN: " + args.map((a) => String(a)).join(" "));
        },
      },
      Math,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean,
      JSON,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      setTimeout: () => {},
      setInterval: () => {},
      clearTimeout: () => {},
      clearInterval: () => {},
    });

    const wrappedCode = `"use strict";\n${sanitizedCode}`;
    const script = new vm.Script(wrappedCode);

    const result = script.runInContext(context, {
      timeout: 5000,
      displayErrors: true,
    });

    const output = logs.length > 0 ? logs.join("\n") : String(result ?? "");

    return {
      success: true,
      output,
      error: null,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Execution failed";

    return {
      success: false,
      output: "",
      error: errorMessage,
    };
  }
}

async function executePythonSafe(code: string): Promise<{
  success: boolean;
  output: string;
  error: string | null;
}> {
  const sanitizedCode = validateCodeInput(code);

  return new Promise<{
    success: boolean;
    output: string;
    error: string | null;
  }>((resolve) => {
    import("child_process").then(({ execFile }) => {
      import("fs").then((fs) => {
        import("os").then((os) => {
          import("path").then((path) => {
            const tmpFile = path.join(os.tmpdir(), `python_${Date.now()}.py`);
            fs.writeFileSync(tmpFile, sanitizedCode, "utf-8");

            execFile(
              "python",
              [tmpFile],
              { timeout: 5000, encoding: "utf-8" },
              (error, stdout, stderr) => {
                try {
                  fs.unlinkSync(tmpFile);
                } catch {
                  // ignore cleanup errors
                }

                if (error) {
                  resolve({
                    success: false,
                    output: stderr || error.message,
                    error: error.message.includes("timeout")
                      ? "Execution timed out (5s limit)"
                      : error.message,
                  });
                } else {
                  resolve({
                    success: true,
                    output: stdout || "(Program executed successfully with no output)",
                    error: null,
                  });
                }
              }
            );
          });
        });
      });
    });
  });
}

export const codeExecutionRouter = router({
  executeJavaScript: protectedProcedure
    .input(z.object({ code: z.string().max(50000) }))
    .mutation(async ({ input }) => {
      const result = await executeJavaScriptSafe(input.code);
      return { ...result, executionTime: 0 };
    }),

  executePython: protectedProcedure
    .input(z.object({ code: z.string().max(50000) }))
    .mutation(async ({ input }) => {
      const result = await executePythonSafe(input.code);
      return { ...result, executionTime: 0 };
    }),

  execute: protectedProcedure
    .input(
      z.object({
        code: z.string().max(50000),
        language: z.enum(["javascript", "python", "typescript"]).default("javascript"),
      })
    )
    .mutation(async ({ input }) => {
      if (input.language === "python") {
        const result = await executePythonSafe(input.code);
        return { ...result, executionTime: 0 };
      }
      const result = await executeJavaScriptSafe(input.code);
      return { ...result, executionTime: 0 };
    }),

  validateSolution: protectedProcedure
    .input(
      z.object({
        exerciseId: z.number(),
        code: z.string().max(50000),
        language: z.enum(["javascript", "python", "typescript"]).default("javascript"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const exerciseRows = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, input.exerciseId))
        .limit(1);

      const exercise = exerciseRows[0];
      if (!exercise) {
        throw new Error("Exercise not found");
      }

      const testCases = (exercise.testCases as any) || [];

      if (testCases.length === 0) {
        return {
          passed: true,
          testResults: [],
          totalTests: 0,
          passedTests: 0,
          xpEarned: exercise.xpReward || 10,
        };
      }

      const testResults: Array<{
        description: string;
        passed: boolean;
        expected: string;
        actual: string;
      }> = [];

      for (const testCase of testCases) {
        let actualOutput = "";
        let passed = false;

        try {
          const execResult =
            input.language === "python"
              ? await executePythonSafe(input.code)
              : await executeJavaScriptSafe(input.code);

          if (execResult.success) {
            actualOutput = execResult.output;
            passed = actualOutput.trim() === String(testCase.expectedOutput).trim();
          } else {
            actualOutput = execResult.error || "Execution failed";
          }
        } catch {
          actualOutput = "Execution error";
        }

        testResults.push({
          description: testCase.description || `Test ${testResults.length + 1}`,
          passed,
          expected: String(testCase.expectedOutput),
          actual: actualOutput,
        });
      }

      const passedTests = testResults.filter((r) => r.passed).length;
      const allPassed = passedTests === testCases.length;

      return {
        passed: allPassed,
        testResults,
        totalTests: testCases.length,
        passedTests,
        xpEarned: allPassed ? (exercise.xpReward || 10) : 0,
      };
    }),
});

export async function validateSolution(params: {
  exerciseId: number;
  code: string;
  language: "javascript" | "python" | "typescript";
}): Promise<{
  passed: boolean;
  testResults: Array<{ description: string; passed: boolean; expected: string; actual: string }>;
  totalTests: number;
  passedTests: number;
  xpEarned: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const exerciseRows = await db
    .select()
    .from(exercises)
    .where(eq(exercises.id, params.exerciseId))
    .limit(1);

  const exercise = exerciseRows[0];
  if (!exercise) {
    throw new Error("Exercise not found");
  }

  const testCases = (exercise.testCases as any) || [];

  if (testCases.length === 0) {
    return {
      passed: true,
      testResults: [],
      totalTests: 0,
      passedTests: 0,
      xpEarned: exercise.xpReward || 10,
    };
  }

  const testResults: Array<{ description: string; passed: boolean; expected: string; actual: string }> = [];

  for (const testCase of testCases) {
    let actualOutput = "";
    let passed = false;

    try {
      const execResult =
        params.language === "python"
          ? await executePythonSafe(params.code)
          : await executeJavaScriptSafe(params.code);

      if (execResult.success) {
        actualOutput = execResult.output;
        passed = actualOutput.trim() === String(testCase.expectedOutput).trim();
      } else {
        actualOutput = execResult.error || "Execution failed";
      }
    } catch {
      actualOutput = "Execution error";
    }

    testResults.push({
      description: testCase.description || `Test ${testResults.length + 1}`,
      passed,
      expected: String(testCase.expectedOutput),
      actual: actualOutput,
    });
  }

  const passedTests = testResults.filter((r) => r.passed).length;
  const allPassed = passedTests === testCases.length;

  return {
    passed: allPassed,
    testResults,
    totalTests: testCases.length,
    passedTests,
    xpEarned: allPassed ? (exercise.xpReward || 10) : 0,
  };
}
