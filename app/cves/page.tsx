import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import { severityBadgeClass, SEVERITY_ORDER, stripMarkdown } from '@/lib/utils'
import type { Severity } from '@/types/database'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/ratelimit'

export const metadata: Metadata = { title: 'CVE Repository' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ severity?: string }>
}

export default async function CvesPage({ searchParams }: Props) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { success } = await checkRateLimit(ip)
  if (!success) {
    return (
      <div className="text-center py-24">
        <p className="text-breach-red text-xl font-mono">429 — Too Many Requests</p>
        <p className="text-ghost text-sm mt-2">Slow down. Try again in a minute.</p>
      </div>
    )
  }

  const { severity } = await searchParams
  const activeSeverity = SEVERITY_ORDER.includes(severity as Severity) ? (severity as Severity) : null

  let cves: any[] = []
  try {
    let query = supabase
      .from('cves')
      .select('*, sections(issue_id, issues(issue_number))')

    if (activeSeverity) {
      query = (query as any).eq('severity', activeSeverity)
    }

    const { data } = await query
    cves = (data as any[]) ?? []

    // Latest issue first, then by severity (critical → unrated) within each issue
    cves.sort((a, b) => {
      const issueA = a.sections?.issues?.issue_number ?? 0
      const issueB = b.sections?.issues?.issue_number ?? 0
      if (issueB !== issueA) return issueB - issueA
      return SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
    })
  } catch {
    cves = []
  }

  return (
    <div className="space-y-8">
      <header className="border-b border-ghost/20 pb-4">
        <h1 className="text-2xl font-bold text-cream">CVE Repository</h1>
        <p className="text-ghost text-sm mt-1">All vulnerabilities tracked across every issue.</p>
      </header>

      {/* Severity filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/cves"
          className={`text-xs font-mono px-3 py-1 rounded border transition-colors ${!activeSeverity ? 'border-cookie-amber text-cookie-amber' : 'border-ghost/30 text-ghost hover:border-ghost'}`}
        >
          All
        </Link>
        {SEVERITY_ORDER.map((sev) => (
          <Link
            key={sev}
            href={`/cves?severity=${sev}`}
            className={`text-xs font-mono px-3 py-1 rounded border transition-colors capitalize ${activeSeverity === sev ? severityBadgeClass(sev) : 'border-ghost/30 text-ghost hover:border-ghost'}`}
          >
            {sev}
          </Link>
        ))}
      </div>

      {cves.length === 0 ? (
        <p className="text-ghost text-center py-12">No CVEs found.</p>
      ) : (
        <div className="space-y-3">
          {cves.map((cve) => {
            const issueNum = (cve.sections as any)?.issues?.issue_number
            return (
              <div key={cve.id} className="border border-ghost/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    {cve.cve_id ? (
                      <Link
                        href={`/cves/${encodeURIComponent(cve.cve_id)}`}
                        className="font-mono text-sm font-bold text-cookie-amber hover:underline"
                      >
                        {cve.cve_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-sm text-ghost">No CVE ID</span>
                    )}
                    <span className={`text-xs uppercase font-bold tracking-wider border px-1.5 py-0.5 rounded ${severityBadgeClass(cve.severity)}`}>
                      {cve.severity}
                    </span>
                    {cve.cvss_score !== null && (
                      <span className="text-xs text-ghost">CVSS {cve.cvss_score}</span>
                    )}
                  </div>
                  <p className="font-semibold text-cream">{cve.product_name}</p>
                  <p className="text-sm text-cream/60 line-clamp-2">{stripMarkdown(cve.product_blurb)}</p>
                </div>
                {issueNum && (
                  <Link
                    href={`/issues/${issueNum}`}
                    className="text-xs text-ghost hover:text-cookie-amber whitespace-nowrap self-start"
                  >
                    Issue #{issueNum}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
