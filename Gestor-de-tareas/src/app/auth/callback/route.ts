import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const supabase = await createClient()
  if (supabase && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) redirect('/tareas')
  }

  redirect('/acceso?confirmacion=error')
}
