import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import IssueSummary from '@/app/components/IssueSummary'

export const metadata: Metadata = { title: 'All Issues' }
export const revalidate = 3600

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ page?: string }>
}

async function getIssues(page: number) {
  try {
    const limit = page * PAGE_SIZE

    const [{ data: issues }, { count }] = await Promise.all([
      supabase
        .from('issues')
        .select('*')
        .order('issue_number', { ascending: false })
        .range(0, limit - 1),
      supabase.from('issues').select('*', { count: 'exact', head: true }),
    ])

    return { issues: issues ?? [], total: count ?? 0 }
  } catch {
    return { issues: [], total: 0 }
  }
}

export default async function IssuesArchivePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)

  const { issues, total } = await getIssues(page)
  const hasMore = issues.length < total

  return (
    <div className="space-y-8">
      <header className="border-b border-ghost/20 pb-4">
        <h1 className="text-2xl font-bold text-cream">All Issues</h1>
        <p className="text-ghost text-sm mt-1">
          {total} issue{total !== 1 ? 's' : ''} published
        </p>
      </header>

      {issues.length === 0 ? (
        <p className="text-ghost text-center py-12">No issues published yet.</p>
      ) : (
        <div className="space-y-6">
          {issues.map((issue) => (
            <div key={issue.id} className="border-b border-ghost/10 pb-6 last:border-0">
              <IssueSummary issue={issue} />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center pt-4">
          <Link
            href={`/issues?page=${page + 1}`}
            className="inline-block px-6 py-2 border border-cookie-amber text-cookie-amber text-sm font-mono rounded hover:bg-cookie-amber hover:text-void-black transition-colors"
          >
            Load More ({total - issues.length} remaining)
          </Link>
        </div>
      )}
    </div>
  )
}
