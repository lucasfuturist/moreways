// File: src/core/util/core.util.logger.ts
// Documentation: File 08-attribution-observability.md
// Role: Structured JSON Logger

import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev ? { target: 'pino-pretty' } : undefined,
  base: {
    env: process.env.NODE_ENV,
    service: process.env.SERVICE_NAME || 'attribution-engine',
  },
  // Redact sensitive keys automatically
  redact: [
    'payload.user.email', 
    'payload.user.phone', 
    'headers.authorization',
    'headers.x_secret_key'
  ]
});