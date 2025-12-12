# 1. Base
FROM node:20-slim AS base

# 2. Dependencies
FROM base AS deps
WORKDIR /app

# Install OpenSSL (Required for Prisma)
RUN apt-get update -y && apt-get install -y openssl

COPY package.json pnpm-lock.yaml* ./

# Enable Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate
# Install deps (allow missing lockfile)
RUN pnpm install --no-frozen-lockfile

# 3. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# [CRITICAL] Triggers 'output: standalone' in next.config.mjs
# This ensures Docker gets the standalone build, while local Windows builds can skip it.
ENV STANDALONE_BUILD 1

# Disable telemetry & validation
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN corepack enable && corepack prepare pnpm@latest --activate

# Inject dummy variables ONLY for the build step to satisfy Zod validation.
RUN CONSOLE_DATABASE_URL="postgresql://build-mock:5432/postgres" \
    OPENAI_API_KEY="sk-mock-key-for-build" \
    ARGUEOS_API_KEY_PUBLIC="mock-key" \
    ARGUEOS_API_KEY_ADMIN="mock-key" \
    pnpm run build

# [CRITICAL FIX] Ensure 'public' directory exists so the COPY command below doesn't fail
RUN mkdir -p public

# 4. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]