import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { SEVERITY_ORDER, severityBadgeClass } from '@/lib/utils'

export const metadata: Metadata = { title: 'Stats' }
export const revalidate = 3600

async function getStats() {
  try {
    const [
      { data: sources },
      { data: cves },
    ] = await Promise.all([
      supabase.from('sources').select('source_name'),
      supabase.from('cves').select('severity'),
    ])

    // Group by a normalized key (case/whitespace-insensitive) so minor
    // spelling drift in the source drafts ("SecurityWeek" vs "Security Week")
    // doesn't fragment the same outlet into separate entries. Display the
    // most common original spelling for each group.
    const normalize = (name: string) => name.toLowerCase().replace(/\s+/g, '')
    const groups: Record<string, { total: number; spellings: Record<string, number> }> = {}
    for (const s of (sources as any[]) ?? []) {
      const key = normalize(s.source_name)
      groups[key] ??= { total: 0, spellings: {} }
      groups[key].total += 1
      groups[key].spellings[s.source_name] = (groups[key].spellings[s.source_name] ?? 0) + 1
    }
    const topSources: [string, number][] = Object.values(groups)
      .map((g) => {
        const displayName = Object.entries(g.spellings).sort((a, b) => b[1] - a[1])[0][0]
        return [displayName, g.total] as [string, number]
      })
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    const severityCounts: Record<string, number> = {}
    for (const c of (cves as any[]) ?? []) {
      severityCounts[c.severity] = (severityCounts[c.severity] ?? 0) + 1
    }
    const totalCves = Object.values(severityCounts).reduce((a, b) => a + b, 0)

    return { topSources, severityCounts, totalCves }
  } catch {
    return { topSources: [], severityCounts: {}, totalCves: 0 }
  }
}

export default async function StatsPage() {
  const { topSources, severityCounts, totalCves } = await getStats()

  const maxSourceCount = topSources[0]?.[1] ?? 1

  return (
    <div className="space-y-12">
      <header className="border-b border-ghost/20 pb-4">
        <h1 className="text-2xl font-bold text-cream">Stats</h1>
        <p className="text-ghost text-sm mt-1">Aggregate intelligence across all published issues.</p>
      </header>

      {/* CVE Severity Distribution */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">CVE Severity Distribution</h2>
        <p className="text-xs text-ghost">{totalCves} total CVEs tracked</p>
        <div className="space-y-3">
          {SEVERITY_ORDER.map((sev) => {
            const count = severityCounts[sev] ?? 0
            const pct = totalCves > 0 ? Math.round((count / totalCves) * 100) : 0
            const barColor = sev === 'critical' ? 'bg-breach-red' : sev === 'high' ? 'bg-cookie-amber' : sev === 'medium' ? 'bg-yellow-400' : sev === 'low' ? 'bg-terminal-green' : 'bg-ghost'
            return (
              <div key={sev} className="flex items-center gap-4">
                <span className={`text-xs font-mono uppercase w-16 text-right ${severityBadgeClass(sev).split(' ')[0]}`}>
                  {sev}
                </span>
                <div className="flex-1 bg-ghost/10 rounded-full h-2">
                  <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-ghost w-16">{count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Top Sources */}
      {topSources.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-cream">Most-Cited Sources</h2>
          <div className="space-y-2">
            {topSources.map(([name, count]) => {
              const pct = Math.round((count / maxSourceCount) * 100)
              return (
                <div key={name} className="flex items-center gap-4">
                  <span className="text-xs text-ghost w-48 text-right truncate">{name}</span>
                  <div className="flex-1 bg-ghost/10 rounded-full h-2">
                    <div className="h-2 rounded-full bg-terminal-green" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-ghost w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {totalCves === 0 && topSources.length === 0 && (
        <p className="text-ghost text-center py-12">No data yet. Stats will populate once issues are published.</p>
      )}
    </div>
  )
}
