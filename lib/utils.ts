import type { SectionType, Severity } from '@/types/database'

// Canonical newsletter order — every issue presents sections in this fixed
// sequence. Do not rely on alphabetical or insertion order anywhere.
export const SECTION_ORDER: SectionType[] = [
  'breach_of_the_day',
  'ai_emerging_threats',
  'vulnerability_watch',
  'defenders_corner',
  'compliance_pulse',
]

export function sortBySectionOrder<T extends { section_type: SectionType }>(sections: T[]): T[] {
  return [...sections].sort(
    (a, b) => SECTION_ORDER.indexOf(a.section_type) - SECTION_ORDER.indexOf(b.section_type)
  )
}

export const SECTION_LABELS: Record<SectionType, string> = {
  breach_of_the_day: "Breach of the Day",
  ai_emerging_threats: "AI & Emerging Threats",
  vulnerability_watch: "Vulnerability Watch",
  defenders_corner: "Defender's Corner",
  compliance_pulse: "Compliance Pulse",
};

// URL slug → section_type
export const SLUG_TO_SECTION: Record<string, SectionType> = {
  "breach-of-the-day": "breach_of_the_day",
  "ai-emerging-threats": "ai_emerging_threats",
  "vulnerability-watch": "vulnerability_watch",
  "defenders-corner": "defenders_corner",
  "compliance-pulse": "compliance_pulse",
};

// section_type → URL slug
export const SECTION_TO_SLUG: Record<SectionType, string> = {
  breach_of_the_day: "breach-of-the-day",
  ai_emerging_threats: "ai-emerging-threats",
  vulnerability_watch: "vulnerability-watch",
  defenders_corner: "defenders-corner",
  compliance_pulse: "compliance-pulse",
};

export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'unrated']

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: 'text-breach-red border-breach-red',
  high: 'text-cookie-amber border-cookie-amber',
  medium: 'text-yellow-400 border-yellow-400',
  low: 'text-terminal-green border-terminal-green',
  unrated: 'text-ghost border-ghost',
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function severityBadgeClass(severity: Severity) {
  return SEVERITY_COLORS[severity]
}

// Strips markdown syntax for plain-text previews (e.g. line-clamped excerpts)
// where rendering real markdown elements would break truncation.
export function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
    .replace(/\*\*([^*]+)\*\*/g, '$1')        // **bold** -> bold
    .replace(/\*([^*]+)\*/g, '$1')            // *italic* -> italic
    .replace(/`([^`]+)`/g, '$1')              // `code` -> code
}
