# Multi-stage Dockerfile for cdat.sdet.it
#
# Stage 1: build Astro hybrid site (static pages prerendered + Node entrypoint
#          for the /mcp SSE endpoint).
# Stage 2: production Node runtime serves dist/server/entry.mjs which handles
#          ALL routes — pre-rendered pages from dist/client/ AND /mcp.
#
# nginx-proxy on the VPS host (existing infra) terminates TLS and proxies to
# this container's port 4399. No nginx inside the container.

# ---- Stage 1: build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm via corepack (Node 22 ships with corepack)
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install dependencies (cache-friendly: copy only manifests first)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm build

# ---- Stage 2: runtime ----
FROM node:22-alpine AS runtime

WORKDIR /app

# Drop privileges
RUN addgroup -S app && adduser -S app -G app

# Copy built artefacts + production node_modules
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./package.json

USER app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4399

EXPOSE 4399

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider "http://localhost:4399/" || exit 1

CMD ["node", "./dist/server/entry.mjs"]
