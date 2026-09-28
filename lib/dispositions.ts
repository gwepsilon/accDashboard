import type { Pool } from 'pg'

export const DISPOSITION_STATUSES = [
  'Ignored',
  'Sent',
  'Failed',
  'Prepared',
  'Transmitted',
] as const

export type DispositionStatus = (typeof DISPOSITION_STATUSES)[number]

export type DispositionRow = {
  deliveryId: number
  label: string
  internalName: string
  counts: Record<DispositionStatus, number>
  total: number
}

export type DispositionsResponse = {
  statuses: DispositionStatus[]
  rows: DispositionRow[]
  generatedAt: string
}

export async function fetchDispositionMatrix(pool: Pool): Promise<DispositionsResponse> {
  const result = await pool.query<{
    id: number
    label: string
    internal_name: string
    status: string | null
    count: string
  }>(`
    SELECT
      d.id,
      d.label,
      d.internal_name,
      b.status::text AS status,
      COUNT(b.id)::text AS count
    FROM deliveries d
    LEFT JOIN broad_log_rcp b ON b.delivery_id = d.id
    GROUP BY d.id, d.label, d.internal_name, b.status
    ORDER BY d.label ASC, d.internal_name ASC
  `)

  const byDelivery = new Map<number, DispositionRow>()

  for (const row of result.rows) {
    let entry = byDelivery.get(row.id)
    if (!entry) {
      entry = {
        deliveryId: row.id,
        label: row.label,
        internalName: row.internal_name,
        counts: {
          Ignored: 0,
          Sent: 0,
          Failed: 0,
          Prepared: 0,
          Transmitted: 0,
        },
        total: 0,
      }
      byDelivery.set(row.id, entry)
    }

    if (row.status && row.count) {
      const status = row.status as DispositionStatus
      const count = Number.parseInt(row.count, 10)
      if (DISPOSITION_STATUSES.includes(status)) {
        entry.counts[status] = count
        entry.total += count
      }
    }
  }

  return {
    statuses: [...DISPOSITION_STATUSES],
    rows: Array.from(byDelivery.values()),
    generatedAt: new Date().toISOString(),
  }
}
