# accDashboard — Delivery Disposition Dashboard

Next.js dashboard for ACC-style delivery dispositions. Recipient status counts come from PostgreSQL tables modeled after **broadLogRcp** (`broad_log_rcp`) joined to **deliveries**.

## Stack

- **Next.js 15** (App Router)
- **PostgreSQL 16** (Docker Compose)
- **API:** `GET /api/dispositions` — matrix of counts by delivery label, internal name, and status

### Disposition statuses

`Ignored`, `Sent`, `Failed`, `Prepared`, `Transmitted`

## Quick start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL)

### 1. Install dependencies

```bash
npm ci
```

### 2. Start PostgreSQL

```bash
npm run db:up
```

Schema and seed data load automatically from `docker/init/` on first container start.

### 3. Configure database URL (optional)

Default connection string matches Docker Compose:

```bash
cp .env.example .env
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the pastel status-square matrix.

## API

### `GET /api/dispositions`

Returns aggregated counts per delivery and status.

```json
{
  "statuses": ["Ignored", "Sent", "Failed", "Prepared", "Transmitted"],
  "rows": [
    {
      "deliveryId": 1,
      "label": "Spring Promo Blast",
      "internalName": "spring_promo_blast_2026",
      "counts": { "Ignored": 1, "Sent": 3, "Failed": 2, "Prepared": 1, "Transmitted": 1 },
      "total": 8
    }
  ],
  "generatedAt": "2026-09-28T12:00:00.000Z"
}
```

## Database schema

| Table | Purpose |
| --- | --- |
| `deliveries` | Campaign/delivery metadata (`label`, `internal_name`) |
| `broad_log_rcp` | Per-recipient disposition rows (`recipient_key`, `status`) |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Next.js dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint (Next.js) |
| `npm run db:up` | `docker compose up -d db` |
| `npm run db:down` | Stop database container |

## Cloud Agents

`.cursor/environment.json` runs `scripts/cloud-agent-install.sh`, starts PostgreSQL via `scripts/cloud-agent-start.sh`, and launches `npm run dev` in a terminal.
