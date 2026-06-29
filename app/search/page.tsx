import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SECTION_LABELS, severityBadgeClass, formatDate, stripMarkdown, sanitizeSearchTerm } from '@/lib/utils'
import type { SectionType } from '@/types/database'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/ratelimit'

export const metadata: Metadata = { title: 'Search' }
export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  // Rate limit when there's an active search query
  if (query) {
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
  }

  // Strip PostgREST filter syntax characters before building any .or() filter
  // — otherwise a search term containing `,` `(` `)` `*` `%` could break out
  // of the intended title/body match. The raw `query` is still used for
  // display ("results for ...") so the user sees what they actually typed.
  const safeTerm = sanitizeSearchTerm(query)

  let sections: any[] = []
  let cves: any[] = []

  if (safeTerm.length >= 2) {
    const [{ data: sectionResults }, { data: cveResults }] = await Promise.all([
      supabase
        .from('sections')
        .select('id, section_type, title, body, issues(issue_number, issue_date)')
        .or(`title.ilike.%${safeTerm}%,body.ilike.%${safeTerm}%`)
        .limit(20),
      supabase
        .from('cves')
        .select('id, cve_id, product_name, severity, cvss_score, sections(issue_id, issues(issue_number))')
        .or(`cve_id.ilike.%${safeTerm}%,product_name.ilike.%${safeTerm}%,product_blurb.ilike.%${safeTerm}%`)
        .limit(10),
    ])
    sections = sectionResults ?? []
    cves = cveResults ?? []
  }

  const total = sections.length + cves.length

  return (
    <div className="space-y-8 max-w-3xl">
      <header className="border-b border-ghost/20 pb-4">
        <h1 className="text-2xl font-bold text-cream">Search</h1>
      </header>

      {/* Search form */}
      <form method="get" className="flex gap-3">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search sections, CVEs, products…"
          className="flex-1 bg-ghost/10 border border-ghost/30 rounded px-4 py-2 text-cream placeholder-ghost focus:outline-none focus:border-cookie-amber text-sm font-mono"
          autoFocus
          minLength={2}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-cookie-amber text-void-black font-bold text-sm rounded hover:bg-cream transition-colors"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {query.length >= 2 && (
        <div className="space-y-6">
          <p className="text-xs text-ghost">
            {total} result{total !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>

          {/* CVE results */}
          {cves.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-mono text-ghost uppercase tracking-widest">CVEs</h2>
              {cves.map((cve) => {
                const issueNum = (cve.sections as any)?.issues?.issue_number
                const href = cve.cve_id ? `/cves/${encodeURIComponent(cve.cve_id)}` : issueNum ? `/issues/${issueNum}` : '/issues'
                return (
                  <Link
                    key={cve.id}
                    href={href}
                    className="block border border-ghost/20 rounded p-4 flex items-start justify-between gap-4 hover:border-cookie-amber/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        {cve.cve_id && (
                          <span className="font-mono text-sm font-bold text-cookie-amber">{cve.cve_id}</span>
                        )}
                        <span className={`text-xs uppercase font-bold border px-1.5 py-0.5 rounded ${severityBadgeClass(cve.severity)}`}>
                          {cve.severity}
                        </span>
                      </div>
                      <p className="text-cream text-sm">{cve.product_name}</p>
                    </div>
                    {issueNum && (
                      <span className="text-xs text-ghost whitespace-nowrap">Issue #{issueNum}</span>
                    )}
                  </Link>
                )
              })}
            </section>
          )}

          {/* Section results */}
          {sections.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-mono text-ghost uppercase tracking-widest">Sections</h2>
              {sections.map((section) => {
                const issue = (section.issues as any)
                const href = issue?.issue_number ? `/issues/${issue.issue_number}` : '/issues'
                return (
                  <Link
                    key={section.id}
                    href={href}
                    className="block border border-ghost/20 rounded p-4 space-y-2 hover:border-cookie-amber/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs text-cookie-amber font-mono uppercase tracking-widest">
                          {SECTION_LABELS[section.section_type as SectionType]}
                        </span>
                        {section.title && (
                          <p className="text-cream font-semibold mt-0.5">{section.title}</p>
                        )}
                      </div>
                      {issue?.issue_number && (
                        <span className="text-xs text-ghost whitespace-nowrap">
                          Issue #{issue.issue_number}
                          {issue.issue_date && <span> · {formatDate(issue.issue_date)}</span>}
                        </span>
                      )}
                    </div>
                    <p className="text-cream/60 text-sm line-clamp-3">{stripMarkdown(section.body)}</p>
                  </Link>
                )
              })}
            </section>
          )}

          {total === 0 && (
            <p className="text-ghost text-center py-12">No results found.</p>
          )}
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <p className="text-ghost text-sm">Enter at least 2 characters to search.</p>
      )}
    </div>
  )
}
