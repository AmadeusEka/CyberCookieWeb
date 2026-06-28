export type SectionType =
  | 'breach_of_the_day'
  | 'vulnerability_watch'
  | 'defenders_corner'
  | 'ai_emerging_threats'
  | 'compliance_pulse'

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'unrated'

export interface Issue {
  id: number
  issue_number: number
  issue_date: string
  title: string
  summary: string
  sign_off: string | null
  created_at: string
}

export interface Section {
  id: number
  issue_id: number
  section_type: SectionType
  title: string | null
  body: string
  word_count: number | null
  created_at: string
}

export interface Cve {
  id: number
  section_id: number
  cve_id: string | null
  product_name: string
  product_blurb: string
  cvss_score: number | null
  severity: Severity
  root_cause: string | null
  attack_vector: string | null
  detection_notes: string | null
  recommended_actions: string | null
  created_at: string
}

export interface Source {
  id: number
  section_id: number
  source_name: string
  url: string
  created_at: string
}

// Enriched types used in page queries
export interface IssueWithSections extends Issue {
  sections: SectionWithDetails[]
}

export interface SectionWithDetails extends Section {
  cves: Cve[]
  sources: Source[]
}

export type Database = {
  public: {
    Tables: {
      issues: { Row: Issue }
      sections: { Row: Section }
      cves: { Row: Cve }
      sources: { Row: Source }
    }
  }
}
