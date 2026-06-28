import Link from 'next/link'
import type { SectionWithDetails } from '@/types/database'
import { SECTION_LABELS, SECTION_TO_SLUG, severityBadgeClass, formatDate } from '@/lib/utils'
import Markdown from './Markdown'

interface Props {
  section: SectionWithDetails
  showIssueLink?: boolean
  issueNumber?: number
  issueDate?: string
}

export default function SectionCard({ section, showIssueLink, issueNumber, issueDate }: Props) {
  const label = SECTION_LABELS[section.section_type]

  return (
    <article className="border border-ghost/20 rounded-lg p-6 space-y-4">
      <header className="space-y-1">
        {showIssueLink && issueNumber && (
          <Link
            href={`/issues/${issueNumber}`}
            className="inline-block text-xs text-ghost hover:text-cookie-amber"
          >
            Issue #{issueNumber}
            {issueDate && <span className="ml-1">· {formatDate(issueDate)}</span>}
          </Link>
        )}
        <div>
          <span className="text-xs font-mono text-cookie-amber uppercase tracking-widest">
            {label}
          </span>
          {section.title && (
            <h2 className="text-xl font-bold text-cream mt-1">{section.title}</h2>
          )}
        </div>
      </header>

      <Markdown>{section.body}</Markdown>

      {/* CVE entries */}
      {section.cves.length > 0 && (
        <div className="space-y-3 pt-2">
          {section.cves.map((cve) => (
            <div key={cve.id} className={`border rounded p-4 space-y-1 ${severityBadgeClass(cve.severity)}`}>
              <div className="flex items-center gap-3">
                {cve.cve_id && (
                  <Link
                    href={`/cves/${encodeURIComponent(cve.cve_id)}`}
                    className="font-mono text-sm font-bold hover:underline"
                  >
                    {cve.cve_id}
                  </Link>
                )}
                <span className="text-xs uppercase font-bold tracking-wider border px-1.5 py-0.5 rounded">
                  {cve.severity}
                </span>
                {cve.cvss_score !== null && (
                  <span className="text-xs text-ghost">CVSS {cve.cvss_score}</span>
                )}
              </div>
              <p className="font-semibold text-cream">{cve.product_name}</p>
              <Markdown className="text-cream/70">{cve.product_blurb}</Markdown>
            </div>
          ))}
        </div>
      )}

      {/* Sources */}
      {section.sources.length > 0 && (
        <div className="pt-2 border-t border-ghost/20">
          <p className="text-xs text-ghost mb-1 uppercase tracking-widest">Sources</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {section.sources.map((src) => (
              <li key={src.id}>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-ghost hover:text-cookie-amber"
                >
                  {src.source_name} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
