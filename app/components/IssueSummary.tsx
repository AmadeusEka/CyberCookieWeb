import Link from 'next/link'
import type { Issue } from '@/types/database'
import { formatDate } from '@/lib/utils'

interface Props {
  issue: Issue
  compact?: boolean
}

export default function IssueSummary({ issue, compact }: Props) {
  return (
    <div className={compact ? 'space-y-1' : 'space-y-3'}>
      <div className="flex items-baseline gap-3">
        <Link
          href={`/issues/${issue.issue_number}`}
          className="text-cookie-amber font-mono text-sm hover:underline"
        >
          #{issue.issue_number}
        </Link>
        <span className="text-ghost text-xs">{formatDate(issue.issue_date)}</span>
      </div>
      <Link href={`/issues/${issue.issue_number}`}>
        <h3 className={`font-bold text-cream hover:text-cookie-amber transition-colors ${compact ? 'text-base' : 'text-xl'}`}>
          {issue.title}
        </h3>
      </Link>
      {!compact && <p className="text-cream/70 text-sm leading-relaxed">{issue.summary}</p>}
    </div>
  )
}
