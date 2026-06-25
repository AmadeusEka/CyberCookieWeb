import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SectionCard from '@/app/components/SectionCard'
import { SLUG_TO_SECTION, SECTION_LABELS } from '@/lib/utils'
import type { SectionWithDetails } from '@/types/database'

export const revalidate = 3600

interface Props {
  params: Promise<{ sectionType: string }>
}

async function getSections(slug: string) {
  const sectionType = SLUG_TO_SECTION[slug]
  if (!sectionType) return null

  try {
    const { data: sections } = await supabase
      .from('sections')
      .select('*, issues(issue_number, issue_date)')
      .eq('section_type', sectionType)
      .order('created_at', { ascending: false })

    if (!sections) return { sectionType, label: SECTION_LABELS[sectionType], sections: [] }

    const sectionIds = (sections as any[]).map((s) => s.id)

    const [{ data: cves }, { data: sources }, { data: sectionTags }] = await Promise.all([
      supabase.from('cves').select('*').in('section_id', sectionIds),
      supabase.from('sources').select('*').in('section_id', sectionIds),
      supabase.from('section_tags').select('section_id, tags(id, name)').in('section_id', sectionIds),
    ])

    const enriched = (sections as any[]).map((s) => {
      const { issues, ...rest } = s
      return {
        ...rest,
        issue_number: issues?.issue_number,
        issue_date: issues?.issue_date,
        cves: (cves as any[])?.filter((c) => c.section_id === s.id) ?? [],
        sources: (sources as any[])?.filter((src) => src.section_id === s.id) ?? [],
        tags: ((sectionTags as any[]) ?? [])
          .filter((st) => st.section_id === s.id)
          .flatMap((st) => st.tags ?? []),
      } as SectionWithDetails & { issue_number?: number; issue_date?: string }
    })

    return { sectionType, label: SECTION_LABELS[sectionType], sections: enriched }
  } catch {
    return { sectionType, label: SECTION_LABELS[sectionType], sections: [] }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionType } = await params
  const data = await getSections(sectionType)
  if (!data) return { title: 'Section Not Found' }
  return { title: data.label }
}

export default async function SectionTypePage({ params }: Props) {
  const { sectionType } = await params
  const data = await getSections(sectionType)

  if (!data) notFound()

  const { label, sections } = data

  return (
    <div className="space-y-8">
      <header className="border-b border-ghost/20 pb-4">
        <p className="text-xs font-mono text-ghost uppercase tracking-widest mb-1">Section Archive</p>
        <h1 className="text-2xl font-bold text-cream">{label}</h1>
        <p className="text-ghost text-sm mt-1">{sections.length} entries across all issues</p>
      </header>

      <div className="space-y-6">
        {sections.length === 0 ? (
          <p className="text-ghost text-center py-12">No entries yet.</p>
        ) : (
          sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              showIssueLink
              issueNumber={(section as any).issue_number}
              issueDate={(section as any).issue_date}
            />
          ))
        )}
      </div>
    </div>
  )
}
