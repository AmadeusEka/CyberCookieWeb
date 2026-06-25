import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { severityBadgeClass } from '@/lib/utils'
import Markdown from '@/app/components/Markdown'

export const revalidate = 3600

interface Props {
  params: Promise<{ cveId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cveId } = await params
  return { title: decodeURIComponent(cveId) }
}

export default async function CveDetailPage({ params }: Props) {
  const { cveId } = await params
  const decoded = decodeURIComponent(cveId)

  let cve: any = null
  try {
    const { data } = await supabase
      .from('cves')
      .select('*, sections(issue_id, section_type, title, issues(issue_number, issue_date, title))')
      .eq('cve_id', decoded)
      .single()
    cve = data
  } catch {
    notFound()
  }

  if (!cve) notFound()

  const section = cve.sections as any
  const issue = section?.issues

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) =>
    value ? (
      <div className="space-y-1">
        <p className="text-xs font-mono text-ghost uppercase tracking-widest">{label}</p>
        <Markdown>{value}</Markdown>
      </div>
    ) : null

  return (
    <div className="max-w-3xl space-y-8">
      <header className="space-y-3 border-b border-ghost/20 pb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-2xl font-bold text-cream">{cve.cve_id ?? 'No CVE ID'}</span>
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
            First reported in Issue #{issue.issue_number} — {issue.title}
          </Link>
        )}
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Root Cause" value={cve.root_cause} />
        <Field label="Attack Vector" value={cve.attack_vector} />
        <Field label="Detection Notes" value={cve.detection_notes} />
        <Field label="Recommended Actions" value={cve.recommended_actions} />
      </div>

      <div className="pt-4 border-t border-ghost/20">
        <Link href="/cves" className="text-sm text-ghost hover:text-cookie-amber">← All CVEs</Link>
      </div>
    </div>
  )
}
