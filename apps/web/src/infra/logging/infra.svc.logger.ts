/**
 * infra.svc.logger
 *
 * Structured logger for internal system events.
 * Related docs: 03-security-and-data-handling.md (Section 4)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  organizationId?: string; // [MULTI-TENANT] Always log context
  userId?: string;
  [key: string]: unknown;
}

class LoggerService {
  private log(level: LogLevel, message: string, context?: LogContext) {
    // [SECURITY] Ensure no PII in logs per Section 4
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...context,
    };
    console[level](JSON.stringify(entry));
  }

  info(message: string, context?: LogContext) { this.log('info', message, context); }
  error(message: string, error: Error, context?: LogContext) {
    this.log('error', message, { ...context, stack: error.stack });
  }
}

export const logger = new LoggerService();
