# 1. Base Image
FROM node:20-slim

# 2. Directory
WORKDIR /usr/src/app

# 3. Dependencies
# Copy both package files to ensure lockfile consistency
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install all dependencies (including devDependencies so we can build)
# Note: If using pnpm, you might need to install pnpm globally first: RUN npm i -g pnpm
RUN npm install

# 4. Source & Build
COPY . .
RUN npm run build

# 5. Credentials
# [SECURITY WARNING] In a real enterprise env, mount this as a volume or use Env Vars.
# Do not bake secrets into the image if this image is ever pushed to a public repo.
COPY credentials.json ./credentials.json

# 6. Runtime
# Use 'node' on the compiled JS for better performance/memory than 'ts-node'
# Assumes 'npm run build' outputs to ./dist
# If your script is inside src/scripts, tsc usually mirrors that structure to dist/scripts
CMD ["node", "dist/scripts/run-drive-ingest.js"]
