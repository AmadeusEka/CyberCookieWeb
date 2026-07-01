import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { severityBadgeClass } from '@/lib/utils'
import Markdown from '@/app/components/Markdown'
import type { Cve, SectionType } from '@/types/database'

interface CveOccurrence extends Cve {
  sections: {
    issue_id: number
    section_type: SectionType
    title: string | null
    issues: { issue_number: number; issue_date: string; title: string } | null
  } | null
}

export const revalidate = 3600

interface Props {
  params: Promise<{ cveId: string }>
}

async function getCveOccurrences(cveId: string) {
  try {
    const { data } = await supabase
      .from('cves')
      .select('*, sections(issue_id, section_type, title, issues(issue_number, issue_date, title))')
      .eq('cve_id', cveId)
      .order('id', { ascending: true })

    return (data as CveOccurrence[]) ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cveId } = await params
  return { title: decodeURIComponent(cveId) }
}

export default async function CveDetailPage({ params }: Props) {
  const { cveId } = await params
  const decoded = decodeURIComponent(cveId)

  const occurrences = await getCveOccurrences(decoded)

  if (occurrences.length === 0) notFound()

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
    value ? (
      <div className="space-y-1">
        <p className="text-xs font-mono text-ghost uppercase tracking-widest">{label}</p>
        <Markdown>{value}</Markdown>
      </div>
    ) : null

  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-2 border-b border-ghost/20 pb-6">
        <span className="font-mono text-2xl font-bold text-cream">{decoded}</span>
        {occurrences.length > 1 && (
          <p className="text-xs text-ghost">Covered in {occurrences.length} issues</p>
        )}
      </header>

      <div className="space-y-8">
        {occurrences.map((cve) => {
          const section = cve.sections
          const issue = section?.issues

          return (
            <article key={cve.id} className="space-y-6 pb-8 border-b border-ghost/10 last:border-0 last:pb-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-sm uppercase font-bold tracking-wider border px-2 py-0.5 rounded ${severityBadgeClass(cve.severity)}`}>
                    {cve.severity}
                  </span>
                  {cve.cvss_score !== null && (
                    <span className="text-sm text-ghost">CVSS {cve.cvss_score}</span>
                  )}
                </div>
                <h1 className="text-xl font-bold text-cream">{cve.product_name}</h1>
                <Markdown className="-mt-2">{cve.product_blurb}</Markdown>
                {issue && (
                  <Link
                    href={`/issues/${issue.issue_number}`}
                    className="text-xs text-ghost hover:text-cookie-amber"
                  >
                    Reported in Issue #{issue.issue_number} — {issue.title}
                  </Link>
                )}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Root Cause" value={cve.root_cause} />
                <Field label="Attack Vector" value={cve.attack_vector} />
                <Field label="Detection Notes" value={cve.detection_notes} />
                <Field label="Recommended Actions" value={cve.recommended_actions} />
              </div>
            </article>
          )
        })}
      </div>

      <div className="pt-4 border-t border-ghost/20">
        <Link href="/cves" className="text-sm text-ghost hover:text-cookie-amber">← All CVEs</Link>
      </div>
    </div>
  )
}
