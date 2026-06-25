import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import SectionCard from './components/SectionCard'
import { formatDate, sortBySectionOrder } from '@/lib/utils'
import type { SectionWithDetails } from '@/types/database'

export const revalidate = 3600

async function getLatestIssue() {
  try {
    const { data: issue } = await supabase
      .from('issues')
      .select('*')
      .order('issue_number', { ascending: false })
      .limit(1)
      .single()

    if (!issue) return null

    const { data: sections } = await supabase
      .from('sections')
      .select('*')
      .eq('issue_id', issue.id)

    if (!sections) return { issue, sections: [] }

    const sectionIds = sections.map((s: any) => s.id)

    const [{ data: cves }, { data: sources }, { data: sectionTags }] = await Promise.all([
      supabase.from('cves').select('*').in('section_id', sectionIds),
      supabase.from('sources').select('*').in('section_id', sectionIds),
      supabase.from('section_tags').select('section_id, tags(id, name)').in('section_id', sectionIds),
    ])

    const enriched: SectionWithDetails[] = (sections as any[]).map((s) => ({
      ...s,
      cves: (cves as any[])?.filter((c) => c.section_id === s.id) ?? [],
      sources: (sources as any[])?.filter((src) => src.section_id === s.id) ?? [],
      tags: ((sectionTags as any[]) ?? [])
        .filter((st) => st.section_id === s.id)
        .flatMap((st) => st.tags ?? []),
    }))

    return { issue: issue as any, sections: sortBySectionOrder(enriched) }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const data = await getLatestIssue()

  if (!data) {
    return (
      <div className="text-center py-24 text-ghost">
        <p className="text-2xl">No issues published yet.</p>
        <p className="mt-2 text-sm">Check back soon.</p>
      </div>
    )
  }

  const { issue, sections } = data

  return (
    <div className="space-y-8">
      <header className="space-y-3 border-b border-ghost/20 pb-6">
        <div className="flex items-center gap-4 text-xs font-mono text-ghost">
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
        <p className="text-right text-sm text-ghost italic border-t border-ghost/20 pt-4">
          {issue.sign_off}
        </p>
      )}

      <div className="text-center pt-4">
        <Link
          href="/issues"
          className="text-sm text-ghost hover:text-cookie-amber transition-colors"
        >
          ← Browse all issues
        </Link>
      </div>
    </div>
  )
}
