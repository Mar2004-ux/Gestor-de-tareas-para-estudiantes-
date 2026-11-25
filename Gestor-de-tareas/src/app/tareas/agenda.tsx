import Link from 'next/link'
import { clasificaciones, clasificar, estados, fechaLegible, prioridades, type Materia, type Tarea } from '@/lib/tareas'
import { cerrarSesion } from './actions'
import { ArchivarMateriaForm, EstadoForm, MateriaForm, TareaForm } from './forms'

export type Filters = { vista?: string; hasta?: string; dia?: string; materia?: string; estado?: string; prioridad?: string; clasificacion?: string }
const titulos = { inicio: 'Mi agenda', tareas: 'Mis tareas', nueva: 'Nueva tarea', materias: 'Mis materias' }

export function Agenda({ filtros, materias, tareas, hoy, error }: {
  filtros: Filters; materias: Materia[]; tareas: Tarea[]; hoy: string; error: boolean
}) {
  const vista = filtros.vista === 'tareas' || filtros.vista === 'materias' || filtros.vista === 'nueva' ? filtros.vista : 'inicio'
  const materiasPorId = new Map(materias.map(materia => [materia.id, materia]))
  const tareasVisibles = vista === 'inicio' ? tareas.filter(tarea => tarea.estado === 'pendiente') : tareas.filter(tarea =>
    (!filtros.hasta || tarea.fecha_limite <= filtros.hasta)
    && (!filtros.dia || tarea.fecha_limite === filtros.dia)
    && (!filtros.materia || tarea.materia_id === filtros.materia)
    && (!filtros.estado || tarea.estado === filtros.estado)
    && (!filtros.prioridad || tarea.prioridad === filtros.prioridad)
    && (!filtros.clasificacion || clasificar(tarea, hoy) === filtros.clasificacion)
  )


  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-shell header-inner">
          <Link href="/tareas" className="dashboard-brand"><span aria-hidden="true">a.</span>Aula</Link>
          <nav aria-label="Navegación principal">
            {Object.entries(titulos).filter(([key]) => key !== 'nueva').map(([key]) => <Link key={key} aria-current={(vista === key || (key === 'tareas' && vista === 'nueva')) ? 'page' : undefined} href={'/tareas?vista=' + key}>{key === 'inicio' ? 'Inicio' : key === 'materias' ? 'Materias' : 'Tareas'}</Link>)}
          </nav>
          <form action={cerrarSesion}><button className="text-button">Cerrar sesión</button></form>
        </div>
      </header>
      <main className="dashboard-shell dashboard-main">
        <div className="dashboard-intro">
          <p>{new Intl.DateTimeFormat('es-CO', {weekday:'long', month:'long', day:'numeric', timeZone:'UTC'}).format(new Date(hoy))}</p>
          <div className="agenda-notebook" aria-hidden="true"><i>✓</i></div><h1>{titulos[vista]}</h1>
          {vista !== 'materias' && vista !== 'nueva' && <Link className="button" href="/tareas?vista=nueva">＋ Nueva tarea</Link>}
        </div>
        {error ? <p className="feedback error" role="alert">No pudimos cargar tus datos. Intenta recargar la página.</p> : (
          <div className="single-view">
            <div className="dashboard-content">
              {(vista === 'inicio' || vista === 'tareas') && <section className="panel" aria-labelledby="lista-tareas">
                <h2 id="lista-tareas">{vista === 'inicio' ? 'Tareas pendientes' : 'Todas las tareas'}</h2>
                {vista === 'tareas' && tareas.length > 0 && <form className="filters" action="/tareas">
                  <input type="hidden" name="vista" value={vista} />
                  {filtros.dia && <input type="hidden" name="dia" value={filtros.dia} />}
                  <label>Materia<select name="materia" defaultValue={filtros.materia ?? ''}>
                    <option value="">Todas</option>
                    {materias.map(materia => <option key={materia.id} value={materia.id}>{materia.nombre}</option>)}
                  </select></label>
                  <Filter name="estado" label="Estado" options={estados} value={filtros.estado} />
                  <Filter name="prioridad" label="Importancia" options={prioridades} value={filtros.prioridad} />
                  <label>Fecha límite hasta<input type="date" name="hasta" defaultValue={filtros.hasta} /></label>
                  <Filter name="clasificacion" label="Clasificación" options={clasificaciones} value={filtros.clasificacion} />
                  <div className="filter-actions">
                    <Link href={'/tareas?vista=' + vista} className="text-button">Limpiar</Link>
                    <button className="button" type="submit">Aplicar filtros</button>
                  </div>
                </form>}
                {tareasVisibles.length > 0 ? <ul className="task-list">
                  {tareasVisibles.map(tarea => {
                    const clasificacion = clasificar(tarea, hoy) ?? 'completada'
                    return <li className={"task-card " + tarea.prioridad} key={tarea.id}>
                      <div className="task-head">
                        <div><h3>{tarea.titulo}</h3><p>{materiasPorId.get(tarea.materia_id)?.nombre} · <time dateTime={tarea.fecha_limite}>{fechaLegible(tarea.fecha_limite)}</time>{tarea.minutos ? ` · ${tarea.minutos} min` : ''}</p></div>
                        <div className="tags"><span className={`tag ${clasificacion}`}>{clasificacion}</span><span className="tag">Prioridad {tarea.prioridad}</span></div>
                      </div>
                      {tarea.descripcion && <p className="task-description">{tarea.descripcion}</p>}
                      <div className="task-actions"><EstadoForm tarea={tarea} /></div>
                      {vista === 'tareas' && <details className="task-edit"><summary>Editar tarea</summary>
                        <TareaForm tarea={tarea} materias={materias} fechaMinima={tarea.fecha_creacion} />
                      </details>}
                    </li>
                  })}
                </ul> : <p className="empty">
                  {vista === 'inicio' ? 'No tienes tareas pendientes.' : tareas.length > 0 ? 'No hay tareas que coincidan con los filtros.' : 'No tienes tareas registradas. Crea una materia y luego agrega tu primera tarea.'}
                </p>}
              </section>}
              {vista === 'nueva' && <section className="panel" id="nueva">
                <h2>Nueva tarea</h2>
                {materias.some(materia => !materia.archivada)
                  ? <TareaForm materias={materias} fechaMinima={hoy} />
                  : <p className="empty">Para registrar una tarea, <Link href="/tareas?vista=materias">crea primero una materia</Link>.</p>}
              </section>}
            </div>
            {vista === 'materias' && <aside className="panel" id="materias"  aria-labelledby="titulo-materias">
              <h2 id="titulo-materias">Materias</h2>
              <MateriaForm />
              {materias.length > 0 && <ul className="subject-list">
                {materias.map(materia => <li key={materia.id}>
                  <div><strong>{materia.nombre}</strong><p>{materia.codigo}{materia.docente && ` · ${materia.docente}`}{materia.archivada ? ' · Archivada' : ''}</p></div>
                  {!materia.archivada && <ArchivarMateriaForm id={materia.id} />}
                </li>)}
              </ul>}
            </aside>}
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
