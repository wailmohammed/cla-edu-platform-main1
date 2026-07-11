/**
 * System Health Monitor
 * Inspired by Website-Agent's monitoring system
 * Provides health checks and system status monitoring for the education platform
 */

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  checks: {
    database: { status: string; latency?: number; error?: string };
    storage: { status: string; latency?: number; error?: string };
    llm: { status: string; latency?: number; error?: string };
    tts: { status: string; error?: string };
  };
  uptime: number;
}

export class HealthMonitor {
  private startTime: Date;
  private checkHistory: HealthCheckResult[] = [];
  private maxHistorySize = 100;

  constructor() {
    this.startTime = new Date();
  }

  getUptime(): number {
    return Date.now() - this.startTime.getTime();
  }

  async checkDatabase(): Promise<{ status: string; latency?: number; error?: string }> {
    const start = Date.now();
    try {
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) {
        return { status: "unhealthy", error: "Database connection not available" };
      }
      // Simple health check - try to execute a query
      await db.execute("SELECT 1");
      return { status: "healthy", latency: Date.now() - start };
    } catch (error) {
      return { 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async checkStorage(): Promise<{ status: string; latency?: number; error?: string }> {
    const start = Date.now();
    try {
      const { ENV } = await import("./env");
      if (!ENV.s3Bucket || !ENV.s3AccessKeyId) {
        return { status: "degraded", error: "Storage not configured" };
      }
      // Storage is available if configured
      return { status: "healthy", latency: Date.now() - start };
    } catch (error) {
      return { 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async checkLLM(): Promise<{ status: string; latency?: number; error?: string }> {
    const start = Date.now();
    try {
      const { ENV } = await import("./env");
      if (!ENV.anthropicApiKey) {
        return { status: "degraded", error: "LLM not configured" };
      }
      // LLM is available if configured
      return { status: "healthy", latency: Date.now() - start };
    } catch (error) {
      return { 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async checkTTS(): Promise<{ status: string; error?: string }> {
    try {
      const { ENV } = await import("./env");
      if (!ENV.fishAudioApiKey) {
        return { status: "degraded", error: "TTS not configured" };
      }
      return { status: "healthy" };
    } catch (error) {
      return { 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const [database, storage, llm, tts] = await Promise.all([
      this.checkDatabase(),
      this.checkStorage(),
      this.checkLLM(),
      this.checkTTS(),
    ]);

    // Determine overall status
    const allChecks = [database, storage, llm, tts];
    const hasUnhealthy = allChecks.some(c => c.status === "unhealthy");
    const hasDegraded = allChecks.some(c => c.status === "degraded");
    
    const overallStatus: "healthy" | "degraded" | "unhealthy" = hasUnhealthy 
      ? "unhealthy" 
      : hasDegraded 
      ? "degraded" 
      : "healthy";

    const result: HealthCheckResult = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks: { database, storage, llm, tts },
      uptime: this.getUptime(),
    };

    this.checkHistory.push(result);
    if (this.checkHistory.length > this.maxHistorySize) {
      this.checkHistory.shift();
    }

    return result;
  }

  getHistory(): HealthCheckResult[] {
    return [...this.checkHistory];
  }

  getLastCheck(): HealthCheckResult | null {
    return this.checkHistory.length > 0 ? this.checkHistory[this.checkHistory.length - 1] : null;
  }
}

// Singleton instance
let healthMonitorInstance: HealthMonitor | null = null;

export function getHealthMonitor(): HealthMonitor {
  if (!healthMonitorInstance) {
    healthMonitorInstance = new HealthMonitor();
  }
  return healthMonitorInstance;
}
