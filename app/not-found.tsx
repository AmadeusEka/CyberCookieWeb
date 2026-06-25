import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
      <p className="font-mono text-6xl text-ghost">404</p>
      <p className="text-cream text-lg font-bold">Page not found.</p>
      <p className="text-ghost text-sm">The issue, CVE, or section you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="mt-4 text-cookie-amber hover:underline text-sm">
        ← Back to latest issue
      </Link>
    </div>
  )
}
