# File: Dockerfile
# Base: Node 20 (LTS) - Alpine for small footprint
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configs
COPY package.json pnpm-lock.yaml tsconfig.json drizzle.config.ts ./

# Install deps (including devDeps for build & migration gen)
RUN pnpm install --frozen-lockfile

# Copy source
COPY src ./src

# [FIX] Create dummy env files to satisfy dotenv-safe.
# We include PORT here so dotenv-safe knows it's a required variable (or at least valid).
RUN printf "PIXEL_DATABASE_URL='postgres://dummy:5432/db'\nHASH_SECRET='build'\nREDIS_URL='redis://dummy:6379'\nPORT=3000" > .env && \
    cp .env .env.example

# 1. Generate SQL Migrations (Ensures 'migrations/' folder exists)
RUN pnpm db:generate

# 2. Build the Pixel (Client) & Server (API + Worker)
RUN pnpm build

# --- RUNNER STAGE ---
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Install only production deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --prod --frozen-lockfile

# Copy artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/migrations ./migrations

# [FIX] Copy the .env.example so dotenv-safe doesn't crash at runtime
COPY --from=builder /app/.env.example ./.env.example

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose API port
EXPOSE 3000

# Default Command
CMD ["node", "dist/api/index.js"]