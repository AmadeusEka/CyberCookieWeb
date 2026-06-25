-- ============================================================
-- Cyber Cookie — initial schema
-- ============================================================

-- One row per published newsletter issue
CREATE TABLE issues (
  id              SERIAL PRIMARY KEY,
  issue_number    INTEGER NOT NULL UNIQUE,
  issue_date      DATE NOT NULL,
  title           TEXT NOT NULL,
  summary         TEXT NOT NULL,
  sign_off        TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- One row per section per issue
CREATE TABLE sections (
  id              SERIAL PRIMARY KEY,
  issue_id        INTEGER NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  section_type    TEXT NOT NULL CHECK (section_type IN (
                    'breach_of_the_day',
                    'vulnerability_watch',
                    'defenders_corner',
                    'ai_emerging_threats',
                    'compliance_pulse'
                  )),
  title           TEXT,
  body            TEXT NOT NULL,
  word_count      INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- CVEs linked to a vulnerability_watch section
CREATE TABLE cves (
  id                    SERIAL PRIMARY KEY,
  section_id            INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  cve_id                TEXT,
  product_name          TEXT NOT NULL,
  product_blurb         TEXT NOT NULL,
  cvss_score            NUMERIC(3,1),
  severity              TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low','unrated')),
  root_cause            TEXT,
  attack_vector         TEXT,
  detection_notes       TEXT,
  recommended_actions   TEXT,
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Source links tied to a section
CREATE TABLE sources (
  id              SERIAL PRIMARY KEY,
  section_id      INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  source_name     TEXT NOT NULL,
  url             TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Tags for topic browsing
CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  TEXT NOT NULL UNIQUE
);

CREATE TABLE section_tags (
  section_id  INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  tag_id      INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (section_id, tag_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_sections_issue_id ON sections(issue_id);
CREATE INDEX idx_sections_type     ON sections(section_type);
CREATE INDEX idx_cves_severity     ON cves(severity);
CREATE INDEX idx_cves_cve_id       ON cves(cve_id);
CREATE INDEX idx_sources_name      ON sources(source_name);
CREATE INDEX idx_issues_date       ON issues(issue_date);

-- ============================================================
-- Row Level Security — public read-only, no anon writes
-- ============================================================
ALTER TABLE issues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE cves         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read issues"       ON issues       FOR SELECT TO anon USING (true);
CREATE POLICY "public read sections"     ON sections     FOR SELECT TO anon USING (true);
CREATE POLICY "public read cves"         ON cves         FOR SELECT TO anon USING (true);
CREATE POLICY "public read sources"      ON sources      FOR SELECT TO anon USING (true);
CREATE POLICY "public read tags"         ON tags         FOR SELECT TO anon USING (true);
CREATE POLICY "public read section_tags" ON section_tags FOR SELECT TO anon USING (true);

-- Table-level privileges. RLS policies (above) decide which rows are visible,
-- but the anon role still needs the SQL-level SELECT grant to read at all.
-- SELECT only — anon gets no INSERT/UPDATE/DELETE, so the publishable key
-- this app uses can never write. (Writes come from the pipeline's secret key.)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
