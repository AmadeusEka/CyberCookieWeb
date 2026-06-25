import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { SECTION_LABELS, SEVERITY_ORDER, severityBadgeClass } from '@/lib/utils'
import type { SectionType, Severity } from '@/types/database'

export const metadata: Metadata = { title: 'Stats' }
export const revalidate = 3600

async function getStats() {
  try {
    const [
      { data: sources },
      { data: sections },
      { data: cves },
    ] = await Promise.all([
      supabase.from('sources').select('source_name'),
      supabase.from('sections').select('section_type, created_at'),
      supabase.from('cves').select('severity'),
    ])

    const sourceCounts: Record<string, number> = {}
    for (const s of (sources as any[]) ?? []) {
      sourceCounts[s.source_name] = (sourceCounts[s.source_name] ?? 0) + 1
    }
    const topSources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 10)

    const sectionCounts: Record<string, number> = {}
    for (const s of (sections as any[]) ?? []) {
      sectionCounts[s.section_type] = (sectionCounts[s.section_type] ?? 0) + 1
    }

    const severityCounts: Record<string, number> = {}
    for (const c of (cves as any[]) ?? []) {
      severityCounts[c.severity] = (severityCounts[c.severity] ?? 0) + 1
    }
    const totalCves = Object.values(severityCounts).reduce((a, b) => a + b, 0)

    return { topSources, sectionCounts, severityCounts, totalCves }
  } catch {
    return { topSources: [], sectionCounts: {}, severityCounts: {}, totalCves: 0 }
  }
}

export default async function StatsPage() {
  const { topSources, sectionCounts, severityCounts, totalCves } = await getStats()

  const maxSourceCount = topSources[0]?.[1] ?? 1
  const maxSectionCount = Math.max(...Object.values(sectionCounts), 1)

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

      {/* Section Volume */}
      {Object.keys(sectionCounts).length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-cream">Section Volume</h2>
          <div className="space-y-3">
            {Object.entries(sectionCounts).map(([type, count]) => {
              const label = SECTION_LABELS[type as SectionType] ?? type
              const pct = Math.round((count / maxSectionCount) * 100)
              return (
                <div key={type} className="flex items-center gap-4">
                  <span className="text-xs text-ghost w-40 text-right truncate">{label}</span>
                  <div className="flex-1 bg-ghost/10 rounded-full h-2">
                    <div className="h-2 rounded-full bg-cookie-amber" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-ghost w-8">{count}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

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
