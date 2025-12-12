// src/infra/logging/infra.svc.logger.ts

/**
 * argueOS – Logger Service
 *
 * Minimal structured logger with PII redaction and organizationId
 * / requestId context support.
 *
 * Related docs:
 * - 03-security-and-data-handling.md (no PII in logs)
 * - 07-agent-guide.md (use infra logger, not raw console.log)
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  organizationId?: string;
  requestId?: string;
  userId?: string;
}

export interface Logger {
  debug(message: string, meta?: unknown, ctx?: LogContext): void;
  info(message: string, meta?: unknown, ctx?: LogContext): void;
  warn(message: string, meta?: unknown, ctx?: LogContext): void;
  error(message: string, meta?: unknown, ctx?: LogContext): void;
}

/**
 * [SECURITY] redact obviously sensitive fields from log metadata.
 * This is conservative on purpose; better to over-redact than leak.
 */
function redactMeta(meta: any): any {
  if (meta == null || typeof meta !== 'object') return meta;

  const SENSITIVE_KEYS = [
    'submissionData',
    'clientEmail',
    'email',
    'fullName',
    'password',
    'passwordHash',
    'token'
  ];

  const clone: Record<string, unknown> = Array.isArray(meta) ? {} : {};

  for (const [key, value] of Object.entries(meta)) {
    if (SENSITIVE_KEYS.includes(key)) {
      clone[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clone[key] = redactMeta(value);
    } else {
      clone[key] = value;
    }
  }

  return clone;
}

/**
 * [INTERNAL] base console logger implementation.
 */
function log(level: LogLevel, message: string, meta?: unknown, ctx?: LogContext) {
  const time = new Date().toISOString();

  const parts: string[] = [`[${time}]`, `[${level.toUpperCase()}]`];

  if (ctx?.organizationId) parts.push(`[org=${ctx.organizationId}]`);
  if (ctx?.requestId) parts.push(`[req=${ctx.requestId}]`);
  if (ctx?.userId) parts.push(`[user=${ctx.userId}]`);

  const base = parts.join(' ');

  if (meta !== undefined) {
    // eslint-disable-next-line no-console
    console.log(base, message, redactMeta(meta));
  } else {
    // eslint-disable-next-line no-console
    console.log(base, message);
  }
}

/**
 * Global logger instance.
 *
 * Usage:
 *   import { logger } from '@/infra/logging/infra.svc.logger';
 *   logger.info('Created form schema', { formSchemaId }, { organizationId });
 */
export const logger: Logger = {
  debug(message, meta, ctx) {
    log('debug', message, meta, ctx);
  },
  info(message, meta, ctx) {
    log('info', message, meta, ctx);
  },
  warn(message, meta, ctx) {
    log('warn', message, meta, ctx);
  },
  error(message, meta, ctx) {
    log('error', message, meta, ctx);
  }
};
