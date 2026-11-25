import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseConfig } from '@/lib/supabase/config'

export async function proxy(request: NextRequest) {
  const config = getSupabaseConfig()
  let response = NextResponse.next({ request })
  if (!config) return response

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(updates, headers) {
        for (const { name, value } of updates) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of updates) response.cookies.set(name, value, options)
        for (const [name, value] of Object.entries(headers)) response.headers.set(name, value)
      },
    },
  })

  await supabase.auth.getClaims()
  return response
}

export const config = { matcher: ['/acceso', '/tareas/:path*'] }
