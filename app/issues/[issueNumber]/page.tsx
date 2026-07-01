import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import SectionCard from '@/app/components/SectionCard'
import { formatDate, sortBySectionOrder } from '@/lib/utils'
import type { Issue, Section, Cve, Source, SectionWithDetails } from '@/types/database'

export const revalidate = 3600

interface Props {
  params: Promise<{ issueNumber: string }>
}

async function getIssue(issueNumber: number) {
  try {
    const { data: issue } = await supabase
      .from('issues')
      .select('*')
      .eq('issue_number', issueNumber)
      .single()

    if (!issue) return null

    const [{ data: nextIssue }, { data: prevIssue }] = await Promise.all([
      supabase.from('issues').select('issue_number').eq('issue_number', issueNumber + 1).maybeSingle(),
      supabase.from('issues').select('issue_number').eq('issue_number', issueNumber - 1).maybeSingle(),
    ])

    const { data: sections } = await supabase
      .from('sections')
      .select('*')
      .eq('issue_id', issue.id)

    const hasNext = !!nextIssue
    const hasPrev = !!prevIssue

    if (!sections || sections.length === 0) return { issue: issue as Issue, sections: [], hasNext, hasPrev }

    const sectionIds = (sections as Section[]).map((s) => s.id)

    const [{ data: cves }, { data: sources }] = await Promise.all([
      supabase.from('cves').select('*').in('section_id', sectionIds),
      supabase.from('sources').select('*').in('section_id', sectionIds),
    ])

    const enriched: SectionWithDetails[] = (sections as Section[]).map((s) => ({
      ...s,
      cves: (cves as Cve[])?.filter((c) => c.section_id === s.id) ?? [],
      sources: (sources as Source[])?.filter((src) => src.section_id === s.id) ?? [],
    }))

    return { issue: issue as Issue, sections: sortBySectionOrder(enriched), hasNext, hasPrev }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { issueNumber } = await params
  const data = await getIssue(Number(issueNumber))
  if (!data) return { title: 'Issue Not Found' }
  return { title: `Issue #${data.issue.issue_number}: ${data.issue.title}` }
}

export default async function IssuePage({ params }: Props) {
  const { issueNumber } = await params
  const num = Number(issueNumber)

  if (isNaN(num)) notFound()

  const data = await getIssue(num)
  if (!data) notFound()

  const { issue, sections, hasNext, hasPrev } = data

  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b border-ghost/20 pb-6">
        <div className="flex items-center gap-4 text-xs font-mono text-ghost">
          <Link href="/" className="hover:text-cookie-amber">← Latest</Link>
          <span className="text-cookie-amber">Issue #{issue.issue_number}</span>
          <span>{formatDate(issue.issue_date)}</span>
        </div>
        <h1 className="text-3xl font-bold text-cream">{issue.title}</h1>
        <p className="text-cream/70 leading-relaxed">{issue.summary}</p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>

      {issue.sign_off && (
        <p className="text-center text-md text-ghost italic border-t border-ghost/20 pt-4">
          {issue.sign_off}
        </p>
      )}

      <p className="text-center text-sm text-ghost/80">
        Cyber Cookie is AI-assisted. Always verify critical information with official sources before acting.
      </p>

      <div className="flex justify-between text-sm text-ghost pt-4 border-t border-ghost/20">
        {hasPrev ? (
          <Link href={`/issues/${num - 1}`} className="hover:text-cookie-amber">← Issue #{num - 1}</Link>
        ) : <span />}
        {hasNext ? (
          <Link href={`/issues/${num + 1}`} className="hover:text-cookie-amber">Issue #{num + 1} →</Link>
        ) : <span />}
      </div>
    </div>
  )
}
