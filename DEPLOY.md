# Deploy — spicyninja.org

Homeserver deploy via Nginx serving the static `dist/` output.

---

## Prerequisites

- Node ≥ 22.12 on build machine (`node --version`)
- Nginx on homeserver
- SSH access to homeserver
- `.env` with real `PUBLIC_AUTH_PASSPHRASE_HASH`

---

## Build

```bash
cd /Users/louisc/my-progs/websites/spicy-ninja-org
# Ensure .env has the real passphrase hash
pnpm install
pnpm build
# Verify: dist/ should contain index.html and 68+ subdirectories
ls dist/
```

---

## Transfer

```bash
# Replace homeserver with your actual host/IP
rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/
```

---

## Nginx config

On homeserver, create `/etc/nginx/sites-available/spicy-ninja-org`:

```nginx
server {
    listen 80;
    server_name spicyninja.local;  # replace with your domain or IP

    root /var/www/spicy-ninja-org;
    index index.html;

    # Astro static output — try file, then .html extension, then 404
    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    # Cache static assets aggressively
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache the bach-math tool
    location /tools/ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/spicy-ninja-org /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Full deploy sequence

```bash
# 1. On Mac — build
cd /Users/louisc/my-progs/websites/spicy-ninja-org
pnpm build

# 2. Smoke test build output
test -f dist/index.html && \
test -f dist/montessori/index.html && \
test -f dist/fundamentals/index.html && \
echo "Build OK" || echo "Build MISSING FILES"

# 3. Transfer
rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/

# 4. Verify on homeserver
curl -I http://spicyninja.local/ | grep "200 OK"
```

---

## Updating content

After dropping new MDX files into `src/content/`:

```bash
pnpm build && rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/
```

No server restart needed — Nginx serves static files.

---

## Changing the passphrase

```bash
# Generate new hash
node -e "const c=require('crypto');console.log(c.createHash('sha256').update('NEW_PASS').digest('hex'))"

# Update .env
echo "PUBLIC_AUTH_PASSPHRASE_HASH=<new_hash>" > .env

# Rebuild and redeploy — hash is baked at build time
pnpm build && rsync -avz --delete dist/ homeserver:/var/www/spicy-ninja-org/
```

---

## Docker alternative (optional)

If you prefer containerised deployment:

```dockerfile
# Dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
ARG PUBLIC_AUTH_PASSPHRASE_HASH
ENV PUBLIC_AUTH_PASSPHRASE_HASH=$PUBLIC_AUTH_PASSPHRASE_HASH
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```bash
# Build image (hash injected at build time, not runtime)
docker build \
  --build-arg PUBLIC_AUTH_PASSPHRASE_HASH=$(grep PUBLIC_AUTH src/.env | cut -d= -f2) \
  -t spicy-ninja-org .

# Run
docker run -d -p 80:80 --name spicy-ninja-org spicy-ninja-org
```
