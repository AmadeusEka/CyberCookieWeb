import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// supabase-js constructs a realtime client (which needs a global WebSocket)
// on createClient(). Node < 22 has no global WebSocket, so we polyfill it for
// the server runtime. This app is read-only and never opens a realtime socket,
// but the constructor still requires WebSocket to exist.
if (typeof globalThis.WebSocket === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ws = require('ws')
  ;(globalThis as { WebSocket?: unknown }).WebSocket = ws.WebSocket ?? ws
}

// Lazily instantiated so the module can be imported at build time
// without requiring env vars to be present.
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local'
    )
  }
  // Uses the publishable key (read-only anon access, governed by RLS).
  // To get full type safety after applying the migration, run:
  //   npx supabase gen types typescript --project-id <ref> > types/supabase.gen.ts
  _client = createClient(url, key)
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as never)[prop]
  },
})
