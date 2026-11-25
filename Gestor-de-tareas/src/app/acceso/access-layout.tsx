import Link from 'next/link'
import type { ReactNode } from 'react'
import './acceso.css'

export function AccessLayout({ title, intro, children }: {
  title: string; intro: string; children: ReactNode
}) {
  return (
    <>
      <header className="dashboard-header">
        <div className="dashboard-shell header-inner">
          <Link className="dashboard-brand" href="/"><span aria-hidden="true">a.</span>Aula</Link>
        </div>
      </header>
      <main className="access-shell dashboard-shell">
        <section className="access-cover" aria-label="Agenda de estudio">
          <div className="access-art" aria-hidden="true"><div className="agenda-notebook"><i>✓</i></div></div>
          <h2>Mi agenda<span>.</span></h2>
          <p>Tus materias, tareas y fechas de entrega en un solo lugar.</p>
        </section>
        <section className="access-card" aria-labelledby="access-heading">
          <h1 id="access-heading">{title}</h1>
          <p className="form-intro">{intro}</p>
          {children}
        </section>
      </main>
    </>
  )
}
