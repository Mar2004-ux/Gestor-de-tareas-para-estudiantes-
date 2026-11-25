import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccessForm } from './access-form'
import './acceso.css'

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
    <main className="login-page">
      <section className="login-aside" aria-label="Organiza tus tareas">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">a.</span>Aula</Link>
        <div className="aside-copy">
          <h1>Menos pendientes.<br />Más espacio para aprender.</h1>
          <p className="aside-description">Todas tus materias y fechas importantes, en un solo lugar.</p>
        </div>
      </section>
      <section className="login-main">
        <div className="mobile-brand"><span className="brand-mark" aria-hidden="true">a.</span>Aula</div>
        <div className="login-form-wrap">
          <h2>{copy[0]}</h2>
          <p className="form-intro">{copy[1]}</p>
          {confirmacion === 'error' && <p className="form-error" role="alert">El enlace de confirmación no se pudo usar. Si tu correo ya está confirmado, inicia sesión. Si sigue pendiente, solicita otro enlace.</p>}
          <AccessForm key={mode} mode={mode} configured={Boolean(supabase)} />
        </div>
      </section>
    </main>
  )
}
