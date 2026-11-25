import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clasificaciones, clasificar, estados, fechaLegible, hoyEnBogota, prioridades, type Materia, type Tarea } from '@/lib/tareas'
import { cerrarSesion } from './actions'
import { ArchivarMateriaForm, EstadoForm, MateriaForm, TareaForm } from './forms'

export const dynamic = 'force-dynamic'

type Filters = { materia?: string; estado?: string; prioridad?: string; clasificacion?: string }

export default async function TasksPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const supabase = await createClient()
  const session = await supabase?.auth.getClaims()
  if (!supabase || !session?.data?.claims.sub) redirect('/acceso')

  const filtros = await searchParams
  const hoy = hoyEnBogota()
  const [materiasResult, tareasResult] = await Promise.all([
    supabase.from('materias').select('id,nombre,codigo,archivada').order('nombre'),
    supabase.from('tareas').select('id,materia_id,titulo,descripcion,fecha_creacion,fecha_limite,prioridad,estado')
      .order('fecha_limite').order('id'),
  ])
  const materias: Materia[] = materiasResult.data ?? []
  const tareas: Tarea[] = (tareasResult.data ?? []) as Tarea[]
  const materiasPorId = new Map(materias.map(materia => [materia.id, materia]))
  const tareasVisibles = tareas.filter(tarea =>
    (!filtros.materia || tarea.materia_id === filtros.materia)
    && (!filtros.estado || tarea.estado === filtros.estado)
    && (!filtros.prioridad || tarea.prioridad === filtros.prioridad)
    && (!filtros.clasificacion || clasificar(tarea, hoy) === filtros.clasificacion)
  )
  const error = materiasResult.error || tareasResult.error

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-shell header-inner">
          <Link href="/tareas" className="dashboard-brand"><span aria-hidden="true">a.</span>Aula</Link>
          <nav aria-label="Navegación principal">
            <Link href="/tareas">Mis tareas</Link>
            <Link href="/tareas#materias">Materias</Link>
          </nav>
          <form action={cerrarSesion}><button className="text-button">Cerrar sesión</button></form>
        </div>
      </header>
      <main className="dashboard-shell dashboard-main">
        <div className="dashboard-intro">
          <div><h1>Mis tareas</h1><p>{session.data.claims.email}</p></div>
          {materias.some(materia => !materia.archivada) && <Link className="button" href="/tareas#nueva">Nueva tarea</Link>}
        </div>
        {error ? <p className="feedback error" role="alert">No pudimos cargar tus datos. Intenta recargar la página.</p> : (
          <div className="dashboard-grid">
            <div className="dashboard-content">
              <section className="panel" aria-labelledby="lista-tareas">
                <h2 id="lista-tareas">Tus tareas</h2>
                {tareas.length > 0 && <form className="filters" action="/tareas">
                  <label>Materia<select name="materia" defaultValue={filtros.materia ?? ''}>
                    <option value="">Todas</option>
                    {materias.map(materia => <option key={materia.id} value={materia.id}>{materia.nombre}</option>)}
                  </select></label>
                  <Filter name="estado" label="Estado" options={estados} value={filtros.estado} />
                  <Filter name="prioridad" label="Prioridad" options={prioridades} value={filtros.prioridad} />
                  <Filter name="clasificacion" label="Clasificación" options={clasificaciones} value={filtros.clasificacion} />
                  <div className="filter-actions">
                    <button className="button secondary">Filtrar</button>
                    <Link href="/tareas" className="text-button">Limpiar</Link>
                  </div>
                </form>}
                {tareasVisibles.length > 0 ? <ul className="task-list">
                  {tareasVisibles.map(tarea => {
                    const clasificacion = clasificar(tarea, hoy) ?? 'completada'
                    return <li className="task-card" key={tarea.id}>
                      <div className="task-head">
                        <div><h3>{tarea.titulo}</h3><p>{materiasPorId.get(tarea.materia_id)?.nombre} · <time dateTime={tarea.fecha_limite}>{fechaLegible(tarea.fecha_limite)}</time></p></div>
                        <div className="tags"><span className={`tag ${clasificacion}`}>{clasificacion}</span><span className="tag">Prioridad {tarea.prioridad}</span></div>
                      </div>
                      {tarea.descripcion && <p className="task-description">{tarea.descripcion}</p>}
                      <div className="task-actions"><EstadoForm tarea={tarea} /></div>
                      <details className="task-edit"><summary>Editar tarea</summary>
                        <TareaForm tarea={tarea} materias={materias} fechaMinima={tarea.fecha_creacion} />
                      </details>
                    </li>
                  })}
                </ul> : <p className="empty">
                  {tareas.length > 0 ? 'No hay tareas que coincidan con los filtros.' : 'No tienes tareas registradas. Crea una materia y luego agrega tu primera tarea.'}
                </p>}
              </section>
              <section className="panel" id="nueva">
                <h2>Nueva tarea</h2>
                {materias.some(materia => !materia.archivada)
                  ? <TareaForm materias={materias} fechaMinima={hoy} />
                  : <p className="empty">Para registrar una tarea, <a href="#materias">crea primero una materia</a>.</p>}
              </section>
            </div>
            <aside className="panel" id="materias" aria-labelledby="titulo-materias">
              <h2 id="titulo-materias">Materias</h2>
              <MateriaForm />
              {materias.length > 0 && <ul className="subject-list">
                {materias.map(materia => <li key={materia.id}>
                  <div><strong>{materia.nombre}</strong><p>{materia.codigo}{materia.archivada ? ' · Archivada' : ''}</p></div>
                  {!materia.archivada && <ArchivarMateriaForm id={materia.id} />}
                </li>)}
              </ul>}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function Filter({ name, label, options, value }: {
  name: string; label: string; options: readonly string[]; value?: string
}) {
  return <label>{label}<select name={name} defaultValue={value ?? ''}>
    <option value="">Todas</option>
    {options.map(option => <option key={option} value={option}>{option}</option>)}
  </select></label>
}
