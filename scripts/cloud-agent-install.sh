#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

if command -v docker >/dev/null 2>&1; then
  docker compose pull db 2>/dev/null || true
fi
