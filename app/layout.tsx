import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: { default: 'Cyber Cookie', template: '%s — Cyber Cookie' },
  description: 'Bite-sized cybersecurity news. Freshly baked.',
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
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
            >
              <Image
                src="/mascot.png"
                alt="Cyber Cookie mascot"
                width={70}
                height={70}
                className="rounded h-9 w-9 md:h-17.5 md:w-17.5"
                priority
              />
              <Image
                src="/White Cyber Cookie Logo.png"
                alt="Cyber Cookie"
                width={200}
                height={120}
                className="h-8 md:h-20 w-auto"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-ghost hover:text-cream transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Mobile nav — native disclosure, no JS needed */}
            <details className="md:hidden relative shrink-0">
              <summary className="list-none cursor-pointer text-ghost hover:text-cream px-2 py-1 text-sm select-none">
                Menu ▾
              </summary>
              <div className="absolute right-0 mt-2 w-44 bg-void-black border border-ghost/20 rounded-lg shadow-lg py-2 flex flex-col">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-4 py-2 text-sm text-ghost hover:text-cream hover:bg-ghost/10"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
          <div className="border-t border-ghost/10">
            <div className="max-w-6xl mx-auto px-4 py-1.5 flex gap-6 md:gap-10 text-xs overflow-x-auto">
              {SECTION_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-ghost/70 hover:text-cookie-amber transition-colors whitespace-nowrap"
                >
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
          <p>Cyber Cookie — Bite-sized cybersecurity news. Freshly baked.</p>
          <p className="mt-1 text-ghost/50">
            All content is for informational purposes only.
          </p>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}
