# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:22-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN corepack prepare pnpm@10.4.1 --activate && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- Runtime stage ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN corepack prepare pnpm@10.4.1 --activate && pnpm install --frozen-lockfile --prod

# Server bundle (esbuild) + client assets (vite) both live under dist/
COPY --from=build /app/dist ./dist
# Drizzle schema/migrations for `pnpm db:push` at deploy time
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
# Bundled agency-agents persona library (loaded at runtime by the agents router)
COPY --from=build /app/server/agents-library ./server/agents-library

EXPOSE 3000
CMD ["node", "dist/index.js"]
