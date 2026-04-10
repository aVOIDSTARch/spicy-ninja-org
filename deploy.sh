#!/usr/bin/env bash
# deploy.sh — build, test, and rsync to homeserver
# Usage: ./deploy.sh [homeserver_host] [remote_path]
#
# Defaults:
#   host: homeserver
#   path: /var/www/spicy-ninja-org/
#
# Example: ./deploy.sh pi.local /var/www/spicy-ninja-org/

set -euo pipefail

HOST="${1:-homeserver}"
REMOTE_PATH="${2:-/var/www/spicy-ninja-org/}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cd "$SCRIPT_DIR"

echo "── spicyninja.org deploy ─────────────────────────────"
echo "  host: $HOST"
echo "  path: $REMOTE_PATH"
echo "──────────────────────────────────────────────────────"

# 1. Tests
echo ""
echo "▶ Running tests..."
pnpm test

# 2. Build
echo ""
echo "▶ Building..."
pnpm build

# 3. Smoke test
echo ""
echo "▶ Smoke test..."
REQUIRED=(
  "dist/index.html"
  "dist/montessori/index.html"
  "dist/fundamentals/index.html"
  "dist/project-track/index.html"
  "dist/project/index.html"
  "dist/blog/index.html"
  "dist/journal/index.html"
)
FAIL=0
for f in "${REQUIRED[@]}"; do
  if [ ! -f "$f" ]; then
    echo "  ✗ MISSING: $f"
    FAIL=1
  else
    echo "  ✓ $f"
  fi
done
if [ "$FAIL" -eq 1 ]; then
  echo ""
  echo "Smoke test failed — aborting deploy."
  exit 1
fi

# 4. Transfer
echo ""
echo "▶ Transferring to $HOST:$REMOTE_PATH ..."
rsync -avz --delete dist/ "$HOST:$REMOTE_PATH"

echo ""
echo "✓ Deploy complete."
echo "  Verify: http://$HOST/"
