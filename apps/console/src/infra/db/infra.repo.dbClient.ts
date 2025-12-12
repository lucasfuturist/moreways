// src/infra/db/infra.repo.dbClient.ts

/**
 * argueOS – DB Client (Prisma)
 *
 * Single PrismaClient instance for the entire app.
 * This module is the only place where the Prisma client
 * is constructed. All repos must import from here.
 *
 * Related docs:
 * - 02-technical-vision-and-conventions.md
 * - 03-security-and-data-handling.md
 * - 04-data-and-api-spec.md
 *
 * Guarantees:
 * - uses CONSOLE_DATABASE_URL from env config
 * - safe to import in both server and script contexts
 */

import { PrismaClient } from '@prisma/client';
import { env } from '@/infra/config/infra.svc.envConfig';
import { logger } from '@/infra/logging/infra.svc.logger';

declare global {
  // eslint-disable-next-line no-var
  var __argueosPrisma__: PrismaClient | undefined;
}

/**
 * [INTERNAL] create a new PrismaClient instance.
 */
function createPrismaClient(): PrismaClient {
  // [SECURITY] database URL comes from validated env config
  if (!env.databaseUrl) {
    throw new Error('CONSOLE_DATABASE_URL is not configured.');
  }

  const client = new PrismaClient({
    log:
      env.nodeEnv === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error']
  });

  if (env.nodeEnv === 'development') {
    logger.info('Initialized PrismaClient', { nodeEnv: env.nodeEnv });
  }

  return client;
}

/**
 * Global Prisma client used by repositories.
 *
 * [MULTI-TENANT] Repos MUST scope all queries by organizationId
 * where applicable. This client does not enforce scoping itself.
 *
 * Usage:
 *   import { db } from '@/infra/db/infra.repo.dbClient';
 *   await db.formSchema.findMany({ where: { organizationId } });
 */
export const db: PrismaClient =
  global.__argueosPrisma__ ??
  (global.__argueosPrisma__ = createPrismaClient());
