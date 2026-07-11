import { z } from "zod";
import { TRPCError } from "@trpc/server";

/**
 * Input validation schemas for security
 */
export const securitySchemas = {
  // Email validation
  email: z.string().email().toLowerCase().max(320),

  // Password validation - strong password requirements
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain uppercase letter")
    .regex(/[a-z]/, "Password must contain lowercase letter")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[^A-Za-z0-9]/, "Password must contain special character"),

  // Username validation
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),

  // URL validation
  url: z.string().url().max(2048),

  // Code input validation
  code: z.string().max(50000), // Limit code size to prevent DoS

  // Text input validation
  text: z.string().max(10000),

  // Number validation
  positiveNumber: z.number().positive(),

  // ID validation
  id: z.number().positive().int(),

  // Date validation
  date: z.date().max(new Date()),
};

/**
 * Sanitize user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ""); // Remove event handlers
}

/**
 * Validate and sanitize code input
 */
export function validateCodeInput(code: string): string {
  if (code.length > 50000) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Code input exceeds maximum size",
    });
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /require\s*\(\s*['"]fs['"]\s*\)/, // File system access
    /require\s*\(\s*['"]child_process['"]\s*\)/, // Process execution
    /eval\s*\(/, // Eval function
    /Function\s*\(/, // Function constructor
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(code)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Code contains potentially dangerous patterns",
      });
    }
  }

  return code;
}

/**
 * Rate limiting configuration
 */
export const rateLimitConfig = {
  // API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per window
  },

  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per window
  },

  // Code execution
  codeExecution: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 executions per minute
  },

  // File upload
  fileUpload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // 50 uploads per hour
  },
};

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private tokens: Map<string, { token: string; timestamp: number }> = new Map();
  private readonly tokenExpiry = 24 * 60 * 60 * 1000; // 24 hours

  generateToken(sessionId: string): string {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.tokens.set(sessionId, {
      token,
      timestamp: Date.now(),
    });
    return token;
  }

  validateToken(sessionId: string, token: string): boolean {
    const stored = this.tokens.get(sessionId);

    if (!stored) {
      return false;
    }

    // Check if token has expired
    if (Date.now() - stored.timestamp > this.tokenExpiry) {
      this.tokens.delete(sessionId);
      return false;
    }

    // Validate token
    return stored.token === token;
  }

  cleanupExpiredTokens(): void {
    const now = Date.now();
    const entriesToDelete: string[] = [];
    this.tokens.forEach((data, sessionId) => {
      if (now - data.timestamp > this.tokenExpiry) {
        entriesToDelete.push(sessionId);
      }
    });
    entriesToDelete.forEach((sessionId) => this.tokens.delete(sessionId));
  }
}

/**
 * Content Security Policy headers
 */
export const cspHeaders = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

/**
 * Input validation middleware
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue: z.ZodIssue) => issue.message).join(", ");
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid input: " + messages,
      });
    }
    throw error;
  }
}

/**
 * SQL injection prevention - parameterized queries
 */
export function sanitizeSQLInput(input: string): string {
  // This should be handled by the ORM (Drizzle), but as a safety measure:
  return input.replace(/['";\\]/g, "\\$&");
}

/**
 * Audit logging
 */
export interface AuditLog {
  timestamp: Date;
  userId: number;
  action: string;
  resource: string;
  resourceId?: number;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  status: "success" | "failure";
  errorMessage?: string;
}

export class AuditLogger {
  private logs: AuditLog[] = [];
  private readonly maxLogs = 10000;

  log(entry: AuditLog): void {
    this.logs.push(entry);

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // In production, this should be persisted to a database
    console.log("[AUDIT]", entry);
  }

  getLogs(userId?: number, limit: number = 100): AuditLog[] {
    let filtered = this.logs;

    if (userId) {
      filtered = filtered.filter((log) => log.userId === userId);
    }

    return filtered.slice(-limit);
  }
}

/**
 * Data encryption utilities
 */
export class DataEncryption {
  // In production, use proper encryption libraries like crypto-js or libsodium
  // This is a placeholder implementation

  encrypt(data: string, key: string): string {
    // Placeholder: In production, use AES-256 encryption
    return Buffer.from(data).toString("base64");
  }

  decrypt(encryptedData: string, key: string): string {
    // Placeholder: In production, use AES-256 decryption
    return Buffer.from(encryptedData, "base64").toString("utf-8");
  }
}

/**
 * Two-factor authentication
 */
export class TwoFactorAuth {
  generateSecret(): string {
    // In production, use speakeasy or similar library
    return Math.random().toString(36).substring(2, 15);
  }

  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  verifyCode(secret: string, code: string): boolean {
    // In production, use speakeasy.totp.verify()
    return code.length === 6 && /^\d+$/.test(code);
  }
}

/**
 * Session management
 */
export interface Session {
  id: string;
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();
  private readonly sessionExpiry = 24 * 60 * 60 * 1000; // 24 hours

  createSession(userId: number, ipAddress?: string, userAgent?: string): string {
    const sessionId = Math.random().toString(36).substring(2, 15);
    const now = new Date();

    this.sessions.set(sessionId, {
      id: sessionId,
      userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.sessionExpiry),
      ipAddress,
      userAgent,
    });

    return sessionId;
  }

  validateSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return null;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  cleanupExpiredSessions(): void {
    const now = new Date();
    const entriesToDelete: string[] = [];
    this.sessions.forEach((session, sessionId) => {
      if (now > session.expiresAt) {
        entriesToDelete.push(sessionId);
      }
    });
    entriesToDelete.forEach((sessionId) => this.sessions.delete(sessionId));
  }
}

export const csrfProtection = new CSRFProtection();
export const auditLogger = new AuditLogger();
export const dataEncryption = new DataEncryption();
export const twoFactorAuth = new TwoFactorAuth();
export const sessionManager = new SessionManager();
