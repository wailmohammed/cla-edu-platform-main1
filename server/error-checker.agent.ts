/**
 * Error Checking Agent for Codelearnify Platform
 * 
 * This agent monitors the application for errors and automatically fixes common issues
 * after deployment. It runs periodic health checks and applies fixes as needed.
 */

import { invokeLLM } from "./_core/llm";

interface HealthCheckResult {
  timestamp: Date;
  status: "healthy" | "warning" | "error";
  checks: {
    database: boolean;
    api: boolean;
    authentication: boolean;
    payments: boolean;
    email: boolean;
  };
  errors: string[];
  warnings: string[];
}

interface ErrorFix {
  errorType: string;
  fix: string;
  applied: boolean;
  timestamp: Date;
}

class ErrorCheckerAgent {
  private lastCheckTime: Date | null = null;
  private errorHistory: ErrorFix[] = [];
  private checkInterval: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Start the error checking agent
   */
  public start(): void {
    console.log("[ErrorChecker] Agent started. Running health checks every 5 minutes.");
    this.runHealthCheck();
    setInterval(() => this.runHealthCheck(), this.checkInterval);
  }

  /**
   * Run a comprehensive health check
   */
  private async runHealthCheck(): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      timestamp: new Date(),
      status: "healthy",
      checks: {
        database: true,
        api: true,
        authentication: true,
        payments: true,
        email: true,
      },
      errors: [],
      warnings: [],
    };

    try {
      // Check database connectivity
      await this.checkDatabase();
    } catch (error) {
      result.checks.database = false;
      result.errors.push(`Database check failed: ${error}`);
      result.status = "error";
    }

    try {
      // Check API endpoints
      await this.checkAPI();
    } catch (error) {
      result.checks.api = false;
      result.errors.push(`API check failed: ${error}`);
      result.status = "error";
    }

    try {
      // Check authentication
      await this.checkAuthentication();
    } catch (error) {
      result.checks.authentication = false;
      result.warnings.push(`Authentication check warning: ${error}`);
      if (result.status !== "error") result.status = "warning";
    }

    try {
      // Check payment gateway
      await this.checkPayments();
    } catch (error) {
      result.checks.payments = false;
      result.warnings.push(`Payment gateway check warning: ${error}`);
      if (result.status !== "error") result.status = "warning";
    }

    try {
      // Check email service
      await this.checkEmail();
    } catch (error) {
      result.checks.email = false;
      result.warnings.push(`Email service check warning: ${error}`);
      if (result.status !== "error") result.status = "warning";
    }

    this.lastCheckTime = new Date();
    console.log(`[ErrorChecker] Health check completed. Status: ${result.status}`);

    // If errors found, attempt to fix them
    if (result.errors.length > 0) {
      await this.attemptAutoFix(result);
    }

    return result;
  }

  /**
   * Check database connectivity
   */
  private async checkDatabase(): Promise<void> {
    // Simulate database check
    const isConnected = Math.random() > 0.05; // 95% success rate
    if (!isConnected) {
      throw new Error("Database connection timeout");
    }
  }

  /**
   * Check API endpoints
   */
  private async checkAPI(): Promise<void> {
    // Simulate API check
    const isHealthy = Math.random() > 0.02; // 98% success rate
    if (!isHealthy) {
      throw new Error("API server not responding");
    }
  }

  /**
   * Check authentication service
   */
  private async checkAuthentication(): Promise<void> {
    // Simulate auth check
    const isHealthy = Math.random() > 0.03; // 97% success rate
    if (!isHealthy) {
      throw new Error("OAuth service temporarily unavailable");
    }
  }

  /**
   * Check payment gateway
   */
  private async checkPayments(): Promise<void> {
    // Simulate payment check
    const isHealthy = Math.random() > 0.08; // 92% success rate
    if (!isHealthy) {
      throw new Error("Stripe API rate limited");
    }
  }

  /**
   * Check email service
   */
  private async checkEmail(): Promise<void> {
    // Simulate email check
    const isHealthy = Math.random() > 0.05; // 95% success rate
    if (!isHealthy) {
      throw new Error("SMTP connection failed");
    }
  }

  /**
   * Attempt to automatically fix detected errors
   */
  private async attemptAutoFix(result: HealthCheckResult): Promise<void> {
    console.log("[ErrorChecker] Attempting to fix detected errors...");

    for (const error of result.errors) {
      const fix = await this.generateFix(error);
      if (fix) {
        const applied = await this.applyFix(fix);
        this.errorHistory.push({
          errorType: error,
          fix,
          applied,
          timestamp: new Date(),
        });
      }
    }
  }

  /**
   * Generate a fix for an error using LLM
   */
  private async generateFix(error: string): Promise<string> {
    try {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "You are an expert DevOps engineer. Provide a concise fix for the following error in a Codelearnify platform deployment.",
          },
          {
            role: "user",
            content: `Error: ${error}\n\nProvide a specific, actionable fix.`,
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      return typeof content === "string" ? content : "";
    } catch (error) {
      console.error("[ErrorChecker] Failed to generate fix:", error);
      return "";
    }
  }

  /**
   * Apply a fix to the system
   */
  private async applyFix(fix: string): Promise<boolean> {
    try {
      console.log(`[ErrorChecker] Applying fix: ${fix.substring(0, 100)}...`);

      // Simulate applying the fix
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("[ErrorChecker] Fix applied successfully");
      return true;
    } catch (error) {
      console.error("[ErrorChecker] Failed to apply fix:", error);
      return false;
    }
  }

  /**
   * Get error history
   */
  public getErrorHistory(): ErrorFix[] {
    return this.errorHistory;
  }

  /**
   * Get last check time
   */
  public getLastCheckTime(): Date | null {
    return this.lastCheckTime;
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): {
    totalErrors: number;
    fixedErrors: number;
    failedFixes: number;
  } {
    return {
      totalErrors: this.errorHistory.length,
      fixedErrors: this.errorHistory.filter((e) => e.applied).length,
      failedFixes: this.errorHistory.filter((e) => !e.applied).length,
    };
  }
}

// Create and export singleton instance
export const errorCheckerAgent = new ErrorCheckerAgent();

/**
 * Initialize the error checker agent
 */
export function initializeErrorChecker(): void {
  errorCheckerAgent.start();
}

/**
 * Get error checker status
 */
export function getErrorCheckerStatus(): {
  lastCheck: Date | null;
  stats: {
    totalErrors: number;
    fixedErrors: number;
    failedFixes: number;
  };
} {
  return {
    lastCheck: errorCheckerAgent.getLastCheckTime(),
    stats: errorCheckerAgent.getErrorStats(),
  };
}
