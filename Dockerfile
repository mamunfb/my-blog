FROM node:22-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches

FROM base AS build-deps
RUN pnpm install --frozen-lockfile

FROM build-deps AS build
COPY . .
RUN pnpm build

FROM base AS production-deps
RUN pnpm install --prod --frozen-lockfile

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Used by DATABASE_URL's sslrootcert option for verified Supabase TLS.
COPY certs/supabase-prod-ca-2021.crt /app/certs/supabase-prod-ca-2021.crt
COPY --from=production-deps /app/node_modules ./node_modules
COPY --from=production-deps /app/package.json ./package.json
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
