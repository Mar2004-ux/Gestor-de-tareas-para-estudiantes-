import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseConfig } from './config'

export async function createClient() {
  const config = getSupabaseConfig()
  if (!config) return null

  const jar = await cookies()
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll(updates) {
        try {
          for (const { name, value, options } of updates) jar.set(name, value, options)
        } catch {
          // The proxy writes refreshed cookies for read-only Server Components.
        }
      },
    },
  })
}
