'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function confirmarCorreo(data: FormData) {
  const tokenHash = data.get('token_hash')
  const supabase = await createClient()

  if (!supabase || typeof tokenHash !== 'string' || !tokenHash) {
    redirect('/acceso?confirmacion=error')
  }

  const { error } = await supabase.auth.verifyOtp({ type: 'email', token_hash: tokenHash })
  if (error) redirect('/acceso?confirmacion=error')
  redirect('/tareas')
}
