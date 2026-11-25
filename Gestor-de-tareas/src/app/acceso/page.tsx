import { AccessLayout } from './access-layout'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccessForm } from './access-form'

export default async function AccessPage({ searchParams }: {
  searchParams: Promise<{ modo?: string; confirmacion?: string }>
}) {
  const { modo, confirmacion } = await searchParams
  const supabase = await createClient()
  if (supabase) {
    const { data } = await supabase.auth.getClaims()
    if (data?.claims.sub) redirect('/tareas')
  }

  const mode = modo === 'registro' ? 'register' : modo === 'reenviar' ? 'resend' : 'login'
  const copy = {
    register: ['Crea tu cuenta', 'Empieza a organizar tus entregas.'],
    resend: ['Reenvía el correo', 'Ingresa el correo con el que te registraste.'],
    login: ['Inicia sesión', 'Continúa organizando tu vida académica.'],
  }[mode]
  return (
    <AccessLayout title={copy[0]} intro={copy[1]}>
          {confirmacion === 'error' && <p className="form-error" role="alert">El enlace de confirmación no se pudo usar. Si tu correo ya está confirmado, inicia sesión. Si sigue pendiente, solicita otro enlace.</p>}
          <AccessForm key={mode} mode={mode} configured={Boolean(supabase)} />
    </AccessLayout>
  )
}
