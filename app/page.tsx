'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'
import type { DispositionStatus, DispositionsResponse } from '@/lib/dispositions'

const STATUS_CLASS: Record<DispositionStatus, string> = {
  Ignored: styles.statusIgnored,
  Sent: styles.statusSent,
  Failed: styles.statusFailed,
  Prepared: styles.statusPrepared,
  Transmitted: styles.statusTransmitted,
}

export default function HomePage() {
  const [data, setData] = useState<DispositionsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await fetch('/api/dispositions')
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            detail?: string
          } | null
          throw new Error(body?.detail ?? `HTTP ${response.status}`)
        }
        const json = (await response.json()) as DispositionsResponse
        if (!cancelled) {
          setData(json)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>accDashboard</p>
        <h1 className={styles.title}>Delivery disposition dashboard</h1>
        <p className={styles.subtitle}>
          Pastel status matrix aggregated from <code>deliveries</code> and{' '}
          <code>broad_log_rcp</code> (ACC broadLogRcp-style recipient logs).
        </p>
      </header>

      {loading ? <p className={styles.loading}>Loading disposition matrix…</p> : null}
      {error ? <p className={styles.error}>{error}</p> : null}

      {data ? (
        <section className={styles.panel} aria-label="Disposition matrix">
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Delivery label</th>
                <th scope="col">Internal name</th>
                {data.statuses.map((status) => (
                  <th key={status} scope="col">{status}</th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.deliveryId}>
                  <td className={styles.deliveryLabel}>{row.label}</td>
                  <td className={styles.internalName}>{row.internalName}</td>
                  {data.statuses.map((status) => (
                    <td key={status} className={styles.statusCell}>
                      <span
                        className={`${styles.statusSquare} ${STATUS_CLASS[status]}`}
                        title={`${status}: ${row.counts[status]}`}
                        aria-label={`${row.label} ${status} ${row.counts[status]}`}
                      >
                        {row.counts[status]}
                      </span>
                    </td>
                  ))}
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.legend} aria-label="Status legend">
            {data.statuses.map((status) => (
              <span key={status} className={styles.legendItem}>
                <span
                  className={`${styles.legendSwatch} ${STATUS_CLASS[status]}`}
                  aria-hidden="true"
                />
                {status}
              </span>
            ))}
          </div>

          <p className={styles.meta}>
            Data from <code>/api/dispositions</code> · updated{' '}
            {new Date(data.generatedAt).toLocaleString()}
          </p>
        </section>
      ) : null}
    </main>
  )
}
