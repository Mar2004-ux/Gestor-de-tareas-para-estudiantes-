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

  const register = modo === 'registro'
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
          <h2>{register ? 'Crea tu cuenta' : 'Inicia sesión'}</h2>
          <p className="form-intro">{register ? 'Empieza a organizar tus entregas.' : 'Continúa organizando tu vida académica.'}</p>
          {confirmacion === 'error' && <p className="form-error" role="alert">El enlace de confirmación es inválido o ya venció.</p>}
          <AccessForm key={modo} register={register} configured={Boolean(supabase)} />
        </div>
      </section>
    </main>
  )
}
