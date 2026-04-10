FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
# PUBLIC_AUTH_PASSPHRASE_HASH must be passed as a build arg — it is baked
# into the client bundle at build time and is NOT a runtime secret.
ARG PUBLIC_AUTH_PASSPHRASE_HASH
ENV PUBLIC_AUTH_PASSPHRASE_HASH=$PUBLIC_AUTH_PASSPHRASE_HASH

COPY . .
RUN pnpm build

# ─── Production image ───────────────────────────────────────────────────────
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
