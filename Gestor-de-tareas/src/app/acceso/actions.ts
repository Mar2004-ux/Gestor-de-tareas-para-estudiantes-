'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { FormState } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'

const credentialsSchema = z.object({
  email: z.email('Ingresa un correo válido.'),
  password: z.string().min(1, 'Ingresa tu contraseña.').max(72, 'La contraseña es demasiado larga.'),
})

export async function authenticate(_previous: FormState, data: FormData): Promise<FormState> {
  const mode = data.get('mode')
  const result = credentialsSchema.safeParse({
    email: String(data.get('email') ?? '').trim().toLowerCase(),
    password: data.get('password'),
  })
  if (!result.success) return { error: result.error.issues[0].message }

  const supabase = await createClient()
  if (!supabase) return { error: 'El acceso aún no está configurado.' }

  if (mode === 'register') {
    if (result.data.password.length < 8) {
      return { error: 'Usa una contraseña de al menos 8 caracteres.' }
    }
    const { data: account, error } = await supabase.auth.signUp(result.data)
    if (error?.code === 'weak_password') return { error: 'Elige una contraseña más segura.' }
    if (error) return { error: 'No pudimos crear la cuenta. Si ya tienes una, intenta iniciar sesión.' }
    if (account.session) redirect('/tareas')
    return { message: 'Revisa tu correo y confirma la cuenta. Luego podrás iniciar sesión.' }
  }

  const { error } = await supabase.auth.signInWithPassword(result.data)
  if (error?.code === 'email_not_confirmed') return { error: 'Confirma tu correo antes de iniciar sesión.' }
  if (error?.code === 'invalid_credentials') return { error: 'Correo o contraseña incorrectos.' }
  if (error) return { error: 'No pudimos iniciar sesión. Inténtalo de nuevo.' }
  redirect('/tareas')
}
