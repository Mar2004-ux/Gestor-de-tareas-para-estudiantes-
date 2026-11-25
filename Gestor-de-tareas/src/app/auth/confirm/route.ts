import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const supabase = await createClient()
  if (supabase && tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ type: 'email', token_hash: tokenHash })
    if (!error) return NextResponse.redirect(new URL('/tareas', request.url))
  }

  return NextResponse.redirect(new URL('/acceso?confirmacion=error', request.url))
}
