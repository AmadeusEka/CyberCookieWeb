import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import SectionCard from '@/app/components/SectionCard'
import { SLUG_TO_SECTION, SECTION_LABELS } from '@/lib/utils'
import type { SectionType, SectionWithDetails, Cve, Source } from '@/types/database'

interface SectionRow {
  id: number
  issue_id: number
  section_type: SectionType
  title: string | null
  body: string
  word_count: number | null
  created_at: string
  issues: { issue_number: number; issue_date: string } | null
}

type EnrichedSection = SectionWithDetails & { issue_number?: number; issue_date?: string }

export const revalidate = 3600

const PAGE_SIZE = 10

interface Props {
  params: Promise<{ sectionType: string }>
  searchParams: Promise<{ page?: string }>
}

async function getSections(slug: string, page: number) {
  const sectionType = SLUG_TO_SECTION[slug]
  if (!sectionType) return null

  try {
    const limit = page * PAGE_SIZE

    // Supabase's .order(referencedTable:) sorts the embedded array *within*
    // each row, not the parent rows themselves — a no-op for this to-one
    // relationship. So fetch everything for this section type and sort by
    // issue_number in JS instead, same approach as /cves.
    const { data: allSections } = await supabase
      .from('sections')
      .select('*, issues(issue_number, issue_date)')
      .eq('section_type', sectionType)

    const total = allSections?.length ?? 0

    if (!allSections) return { sectionType, label: SECTION_LABELS[sectionType], sections: [], total }

    const sorted = [...(allSections as SectionRow[])].sort(
      (a, b) => (b.issues?.issue_number ?? 0) - (a.issues?.issue_number ?? 0)
    )
    const sections = sorted.slice(0, limit)

    const sectionIds = sections.map((s) => s.id)

    const [{ data: cves }, { data: sources }] = await Promise.all([
      supabase.from('cves').select('*').in('section_id', sectionIds),
      supabase.from('sources').select('*').in('section_id', sectionIds),
    ])

    const enriched = (sections as SectionRow[]).map((s) => {
      const { issues, ...rest } = s
      return {
        ...rest,
        issue_number: issues?.issue_number,
        issue_date: issues?.issue_date,
        cves: (cves as Cve[])?.filter((c) => c.section_id === s.id) ?? [],
        sources: (sources as Source[])?.filter((src) => src.section_id === s.id) ?? [],
      } as EnrichedSection
    })

    return { sectionType, label: SECTION_LABELS[sectionType], sections: enriched as EnrichedSection[], total }
  } catch {
    return { sectionType, label: SECTION_LABELS[sectionType], sections: [], total: 0 }
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sectionType } = await params
  const data = await getSections(sectionType, 1)
  if (!data) return { title: 'Section Not Found' }
  return { title: data.label }
}

export default async function SectionTypePage({ params, searchParams }: Props) {
  const { sectionType } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const data = await getSections(sectionType, page)

  if (!data) notFound()

  const { label, sections, total } = data as { label: string; sections: EnrichedSection[]; total: number; sectionType: string }
  const hasMore = sections.length < total

  return (
    <div className="space-y-8">
      <header className="border-b border-ghost/20 pb-4">
        <p className="text-xs font-mono text-ghost uppercase tracking-widest mb-1">Section Archive</p>
        <h1 className="text-2xl font-bold text-cream">{label}</h1>
        <p className="text-ghost text-sm mt-1">{total} entries across all issues</p>
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
              issueNumber={section.issue_number}
              issueDate={section.issue_date}
            />
          ))
        )}
      </div>

      {hasMore && (
        <div className="text-center pt-4">
          <Link
            href={`/sections/${sectionType}?page=${page + 1}`}
            className="inline-block px-6 py-2 border border-cookie-amber text-cookie-amber text-sm font-mono rounded hover:bg-cookie-amber hover:text-void-black transition-colors"
          >
            Load More ({total - sections.length} remaining)
          </Link>
        </div>
      )}
    </div>
  )
}
