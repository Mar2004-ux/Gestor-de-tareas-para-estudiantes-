'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { FormState } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'

const emailSchema = z.email('Ingresa un correo válido.')
const passwordSchema = z.string().min(1, 'Ingresa tu contraseña.').max(72, 'La contraseña es demasiado larga.')

export async function authenticate(_previous: FormState, data: FormData): Promise<FormState> {
  const mode = data.get('mode')
  const email = emailSchema.safeParse(String(data.get('email') ?? '').trim().toLowerCase())
  if (!email.success) return { error: email.error.issues[0].message }

  const supabase = await createClient()
  if (!supabase) return { error: 'El acceso aún no está configurado.' }

  if (mode === 'resend') {
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.data })
    if (error?.status === 429) return { error: 'Espera un momento antes de solicitar otro correo.' }
    if (error && error.code !== 'user_not_found' && error.code !== 'email_already_confirmed') {
      return { error: 'No pudimos enviar el correo. Inténtalo de nuevo en unos minutos.' }
    }
    return { message: 'Si tu cuenta sigue pendiente de confirmación, recibirás un enlace nuevo.' }
  }

  const password = passwordSchema.safeParse(data.get('password'))
  if (!password.success) return { error: password.error.issues[0].message }
  const credentials = { email: email.data, password: password.data }

  if (mode === 'register') {
    if (credentials.password.length < 8) {
      return { error: 'Usa una contraseña de al menos 8 caracteres.' }
    }
    const { data: account, error } = await supabase.auth.signUp(credentials)
    if (error?.code === 'weak_password') return { error: 'Elige una contraseña más segura.' }
    if (error) return { error: 'No pudimos crear la cuenta. Si ya tienes una, intenta iniciar sesión.' }
    if (account.session) redirect('/tareas')
    return { message: 'Revisa tu correo y abre el enlace para confirmar la cuenta.' }
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)
  if (error?.code === 'email_not_confirmed') return { error: 'Tu correo está pendiente de confirmación. Abre el enlace más reciente o solicita otro.' }
  if (error?.code === 'invalid_credentials') return { error: 'Correo o contraseña incorrectos.' }
  if (error) return { error: 'No pudimos iniciar sesión. Inténtalo de nuevo.' }
  redirect('/tareas')
}
