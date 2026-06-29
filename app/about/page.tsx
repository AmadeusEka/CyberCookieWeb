import type { Metadata } from 'next'

const TITLE = 'About Cyber Cookie — Bite-sized cybersecurity news in plain English'
const DESCRIPTION =
  "Cyber Cookie is your daily cybersecurity digest in plain English. What happened, why it matters, and what to do about it, every single day."

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    siteName: 'Cyber Cookie',
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <header className="border-b border-ghost/20 pb-4">
        <h1 className="text-2xl font-bold text-cream">About Cyber Cookie</h1>
        <p className="text-ghost text-sm mt-1">Bite-sized cybersecurity news. Freshly baked.</p>
      </header>

      <section className="space-y-4">
        <p className="text-cream/80 leading-relaxed text-sm">
          Cyber Cookie is your daily cybersecurity digest, written in plain English.
          Every day, it reads through the latest security news, picks the stories
          that matter, and tells you what happened, why it matters, and what to do
          about it.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Because staying on top of cybersecurity shouldn&apos;t mean reading vendor
          advisories, CVE databases, and jargon-heavy blogs yourself. Cyber Cookie
          does that part for you, and hands back the version that actually makes
          sense. No CS degree required. No fear-mongering. Just the signal, every
          single time.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">Who Cyber Cookie is for</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          You don&apos;t need to be a security professional to read Cyber Cookie. You
          just need to be someone who uses the internet, which is to say, everyone.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Maybe you&apos;ve seen the term &ldquo;CVE&rdquo; before but couldn&apos;t define it
          under pressure. Maybe you manage your own passwords, your own Wi-Fi
          router, and your own family&apos;s laptops, and you&apos;d like a heads-up before
          the next big breach affects you. Maybe you work in tech but security
          isn&apos;t your specific lane, and you want to stay sharp without making it a
          second job.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Cyber Cookie is built for people who don&apos;t want to do the technical
          research themselves. Not because they couldn&apos;t, but because life is
          short and someone should do that work for them, properly, every day.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">What&apos;s inside every issue</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          Each Cyber Cookie issue follows the same five-part structure, every
          single day, so you always know where to find what you need.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          <strong className="font-bold text-cream">Breach of the Day</strong> is
          the biggest cybersecurity story of the day, fully explained: who got
          hit, how, how many people were affected, and what you should do about
          it.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          <strong className="font-bold text-cream">AI and Emerging Threats</strong>{' '}
          covers how attackers are using new technology, and how defenders are
          fighting back, with the actual mechanism explained, not just the
          headline.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          <strong className="font-bold text-cream">Vulnerability Watch</strong>{' '}
          breaks down one notable vulnerability (CVE) from the last 24 hours:
          what the affected software actually does, how the flaw works, who&apos;s
          at risk, and how to detect or fix it.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          <strong className="font-bold text-cream">Defender&apos;s Corner</strong>{' '}
          gives you one practical tool, habit, or setting you can act on right
          now. Always specific. Never generic &ldquo;use a strong password&rdquo; advice.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          <strong className="font-bold text-cream">Compliance Pulse</strong> covers
          one regulatory or policy update that affects everyday people or small
          businesses, not just enterprise legal teams.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          If a story doesn&apos;t come with a clear &ldquo;what should you do next,&rdquo; it
          doesn&apos;t run. That&apos;s the one rule that never bends.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">How Cyber Cookie is made</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          This is the part most newsletters don&apos;t tell you, so we will: Cyber
          Cookie is produced by a multi-agent AI pipeline, designed and built
          end-to-end.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Here&apos;s how it actually works. Every day, the pipeline scans
          cybersecurity news from a wide range of sources. An AI Scorer reads the
          headlines and briefs, not the full articles, to flag the stories worth
          covering. An AI Writer then drafts the full issue from the real source
          material (full articles), in Cyber Cookie&apos;s voice. An AI Reviewer checks that draft
          against the original sources for factual accuracy, brand consistency,
          and reading level before the issue is published.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Quality isn&apos;t left to chance, either. Before any issue goes live, it
          passes through a final automated validation step that hard-rejects
          anything malformed: a missing section, an empty story, or a CVE that
          didn&apos;t parse correctly. An issue that fails that check doesn&apos;t
          publish. It&apos;s the kind of backstop that exists precisely because the
          pipeline runs on its own schedule.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">Honest about the AI</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          A lot of &ldquo;AI-assisted&rdquo; content tries to hide the fact. Cyber Cookie
          does the opposite.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          Cyber Cookie is AI-generated. Issues are written, reviewed, and
          published by the pipeline on a daily schedule. That&apos;s the whole point
          of the project: to see how far a well-designed, self-checking AI
          system can be trusted to run a real editorial product. The AI
          Reviewer and the final validation step are what stand between a draft
          and your screen, and they&apos;re built to be strict.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          But automation isn&apos;t infallibility, and pretending otherwise would be
          exactly the kind of thing Cyber Cookie exists to push back against. An
          AI can still misread a source, miss nuance, or get a detail wrong. So
          treat every issue the way you should treat any security source: as a
          well-informed starting point, not the final word. The technical
          recommendations in particular are a prompt to go verify, never a
          substitute for the official vendor advisory.
        </p>
        <p className="text-ghost/60 text-xs italic">
          Every recommendation and technical explanation in Cyber Cookie is
          AI-generated. Always verify critical information with official
          sources before acting on it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">Built with security in mind</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          The pipeline that produces Cyber Cookie and the public website you&apos;re
          reading this on were designed with the same principle that shows up
          everywhere in real security engineering: never give a system more
          access than it needs.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          The system that writes content and the system that serves this
          website are two separate applications, with two separate sets of
          credentials. The website you&apos;re on right now is physically incapable
          of writing to the database behind it. It can only read. That&apos;s not an
          accident. It&apos;s a deliberate trust boundary, built the way a
          production system should be, so that a problem on the public side can
          never reach back and corrupt the content behind it.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          If you want the deeper technical story, including the architecture,
          the database design, and the specific engineering decisions behind
          Cyber Cookie, <span className="text-ghost">that&apos;s coming soon.</span>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-cream">Where to find Cyber Cookie</h2>
        <p className="text-cream/80 leading-relaxed text-sm">
          Cyber Cookie publishes a new issue every day, right here on the web,
          searchable, indexed, and free to browse anytime.
        </p>
        <p className="text-cream/80 leading-relaxed text-sm">
          No account required to read. No paywall on the daily brief. Just
          bite-sized cybersecurity news, freshly baked, every day.
        </p>
      </section>
    </div>
  )
}
