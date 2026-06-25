import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: { default: 'Cyber Cookie', template: '%s — Cyber Cookie' },
  description: 'Daily cybersecurity intelligence: breaches, CVEs, defensive tactics, and emerging threats.',
}

const NAV_LINKS = [
  { href: '/',                label: 'Latest' },
  { href: '/issues',          label: 'Issues' },
  { href: '/cves',           label: 'CVEs' },
  { href: '/stats',          label: 'Stats' },
  { href: '/search',         label: 'Search' },
]

const SECTION_LINKS = [
  { href: '/sections/breach-of-the-day',    label: 'Breach of the Day' },
  { href: '/sections/vulnerability-watch',  label: 'Vulnerability Watch' },
  { href: '/sections/defenders-corner',     label: "Defender's Corner" },
  { href: '/sections/ai-emerging-threats',  label: 'AI and Emerging Threats' },
  { href: '/sections/compliance-pulse',     label: 'Compliance Pulse' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geistMono.variable}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-ghost/20 sticky top-0 z-50 bg-void-black/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/mascot.png" alt="Cyber Cookie mascot" width={60} height={60} className="rounded" priority />
              <Image
                src="/White Cyber Cookie Logo.png"
                alt="Cyber Cookie"
                width={250}
                height={120}
                className="h-30 w-auto"
                priority
              />
            </Link>
            <nav className="flex items-center gap-8 text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-ghost hover:text-cream transition-colors">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-ghost/10">
            <div className="max-w-6xl mx-auto px-4 py-1.5 flex gap-10 text-xs overflow-x-auto">
              {SECTION_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="text-ghost/70 hover:text-cookie-amber transition-colors whitespace-nowrap">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-ghost/20 py-6 text-center text-xs text-ghost">
          <p>Cyber Cookie — daily cybersecurity intelligence.</p>
          <p className="mt-1 text-ghost/50">All content is for informational purposes only.</p>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}
