# File Scan

**Roots:**

- `C:\projects\moreways\attribution-engine\docker`


## Tree: C:\projects\moreways\attribution-engine\docker

```
docker/

├── Dockerfile.api
├── Dockerfile.worker

```

## Files

### `C:/projects/moreways/attribution-engine/docker/Dockerfile.api`

```api
# SWITCH TO DEBIAN (SLIM) TO FIX IPV6 CRASHES
FROM node:20-slim

WORKDIR /app

# 1. Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Force IPv4 (Debian respects this)
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# 3. Copy config files AND .env.example
COPY package.json pnpm-lock.yaml tsconfig.json drizzle.config.ts .env.example ./

# 4. Install dependencies
RUN pnpm install --frozen-lockfile

# 5. Copy source code & migrations
COPY src ./src
COPY migrations ./migrations

# 6. Copy the Pixel files (The folder structure)
COPY public ./public

# 7. [NEW] Build the Pixel (Generates tracking.js inside public/)
RUN npm run build:pixel && mv public/index.global.js public/tracking.js

# 8. Expose Port
EXPOSE 3000

# 9. Start API
CMD ["npx", "tsx", "src/api/index.ts"]
```

### `C:/projects/moreways/attribution-engine/docker/Dockerfile.worker`

```worker
# SWITCH TO DEBIAN (SLIM) TO FIX IPV6 CRASHES
FROM node:20-slim

WORKDIR /app

# 1. Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 2. Force IPv4
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# 3. Copy config files AND .env.example
COPY package.json pnpm-lock.yaml tsconfig.json drizzle.config.ts .env.example ./

# 4. Install dependencies
RUN pnpm install --frozen-lockfile

# 5. Copy source code
COPY src ./src

# 6. No Port Exposed

# 7. Start Worker
CMD ["npx", "tsx", "src/worker/index.ts"]
```

