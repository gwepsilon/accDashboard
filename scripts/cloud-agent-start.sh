#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if command -v docker >/dev/null 2>&1; then
  docker compose up -d db
else
  if command -v pg_ctlcluster >/dev/null 2>&1; then
    sudo pg_ctlcluster 16 main start 2>/dev/null || true
    if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='acc_dashboard'" | grep -q 1; then
      sudo -u postgres psql -v ON_ERROR_STOP=1 -f /workspace/scripts/bootstrap-local-postgres.sql
      sudo -u postgres psql -v ON_ERROR_STOP=1 -d acc_dashboard -f /workspace/docker/init/01-schema.sql
      sudo -u postgres psql -v ON_ERROR_STOP=1 -d acc_dashboard -f /workspace/docker/init/02-seed.sql
    fi
    echo "Using local PostgreSQL (Docker not available)."
    exit 0
  fi
  echo "Docker is not available; start PostgreSQL manually or set DATABASE_URL."
  exit 0
fi

for _ in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U acc -d acc_dashboard >/dev/null 2>&1; then
    echo "PostgreSQL is ready."
    exit 0
  fi
  sleep 2
done

echo "PostgreSQL did not become ready in time." >&2
exit 1
