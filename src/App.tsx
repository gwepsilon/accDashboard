import { useMemo, useState } from 'react'
import './App.css'

type Site = {
  id: string
  url: string
  score: number | null
  lastScanned: string | null
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

function App() {
  const [sites, setSites] = useState<Site[]>([
    {
      id: 'demo',
      url: 'https://example.com',
      score: 87,
      lastScanned: '2026-09-28T10:00:00.000Z',
    },
  ])
  const [urlInput, setUrlInput] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const overallScore = useMemo(() => {
    const scored = sites.filter((s) => s.score !== null)
    if (scored.length === 0) return null
    const total = scored.reduce((sum, s) => sum + (s.score ?? 0), 0)
    return Math.round(total / scored.length)
  }, [sites])

  function addSite() {
    const url = normalizeUrl(urlInput)
    if (!url) {
      setMessage('Enter a site URL to monitor.')
      return
    }
    if (sites.some((s) => s.url === url)) {
      setMessage('That site is already on your dashboard.')
      return
    }
    setSites((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        url,
        score: null,
        lastScanned: null,
      },
    ])
    setUrlInput('')
    setMessage(`Added ${url}. Run a scan to get a WCAG score.`)
  }

  function runScan(siteId: string) {
    setSites((prev) =>
      prev.map((site) => {
        if (site.id !== siteId) return site
        const score = 72 + Math.floor(Math.random() * 25)
        return {
          ...site,
          score,
          lastScanned: new Date().toISOString(),
        }
      }),
    )
    setMessage('Scan complete (demo). Scores are simulated for local development.')
  }

  return (
    <div className="layout">
      <header className="header">
        <div>
          <p className="eyebrow">accDashboard</p>
          <h1>Accessibility compliance overview</h1>
          <p className="lede">
            Monitor WCAG-style scores across sites. This dev build uses simulated
            scans so agents can verify the UI without external APIs.
          </p>
        </div>
        <div className="score-card" aria-live="polite">
          <span className="score-label">Overall score</span>
          <span className="score-value">
            {overallScore === null ? '—' : `${overallScore}%`}
          </span>
        </div>
      </header>

      <section className="panel" aria-labelledby="add-site-heading">
        <h2 id="add-site-heading">Add monitored site</h2>
        <form
          className="add-form"
          onSubmit={(event) => {
            event.preventDefault()
            addSite()
          }}
        >
          <label className="sr-only" htmlFor="site-url">Site URL</label>
          <input
            id="site-url"
            name="site-url"
            type="url"
            placeholder="www.yoursite.com"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            autoComplete="url"
          />
          <button type="submit">Add site</button>
        </form>
        {message ? (
          <p className="status" role="status">{message}</p>
        ) : null}
      </section>

      <section className="panel" aria-labelledby="sites-heading">
        <h2 id="sites-heading">Monitored sites</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">URL</th>
              <th scope="col">Score</th>
              <th scope="col">Last scan</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td>{site.url}</td>
                <td>{site.score === null ? 'Not scanned' : `${site.score}%`}</td>
                <td>
                  {site.lastScanned
                    ? new Date(site.lastScanned).toLocaleString()
                    : '—'}
                </td>
                <td>
                  <button type="button" onClick={() => runScan(site.id)}>
                    Run scan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default App
