# syntax=docker/dockerfile:1.7

# ----- stage 1: build ---------------------------------------------------------
# Includes devDependencies because tsc needs @types/* and ts-node to compile.
FROM docker.io/library/node:20-slim AS build

WORKDIR /app

# Install deps first for better layer caching. Copy manifests only.
# `npm ci` is preferred over `npm install` for reproducible, faster builds.
# It requires package-lock.json to be in sync with package.json, which was
# reconciled in this fork (upstream's lockfile was stale due to billing-locked
# CI — see Ashutosh00710/github-readme-activity-graph#257).
COPY package.json package-lock.json ./

RUN npm ci --no-audit --no-fund

# Copy source and compile TypeScript -> dist/
COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Prune devDependencies so the runtime stage only carries what dist/main.js
# actually needs. (Keeps `@types/*`, `ts-node`, `nodemon`, `jest` out.)
RUN npm prune --omit=dev

# ----- stage 2: runtime -------------------------------------------------------
# Slim runtime carrying only dist/ + production node_modules + static assets
# the server reads at request time.
FROM docker.io/library/node:20-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5100

# Non-root user for rootless-friendly runs (podman, k8s, DO App Platform).
# node:20-slim already ships a `node` user (uid 1000); just use it.
USER node

# Copy pruned production deps and compiled output.
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

# `.env.example` documents TOKEN=<GitHub PAT>; the real secret is injected
# at runtime via -e / env_file / DO App Platform env vars.
EXPOSE 5100

# Express health signal: GET / returns 200 with the demo page, GET /graph
# returns the SVG (or a graceful error-graph SVG on bad/missing TOKEN).
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:'+process.env.PORT+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/main.js"]