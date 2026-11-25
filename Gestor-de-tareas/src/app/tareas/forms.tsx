'use client'

import { useActionState, useState } from 'react'
import type { FormState } from '@/lib/forms'
import { prioridades, type Materia, type Tarea } from '@/lib/tareas'
import { archivarMateria, cambiarEstado, crearMateria, guardarTarea } from './actions'

function Feedback({ state }: { state: FormState }) {
  if (state.error) return <p className="feedback error" role="alert">{state.error}</p>
  if (state.message) return <p className="feedback success" role="status">{state.message}</p>
  return null
}

export function MateriaForm() {
  const [state, action, pending] = useActionState(crearMateria, {})
  return (
    <form action={action} className="field-stack">
      <label>Nombre<input name="nombre" placeholder="Ej. Cálculo" required maxLength={120} /></label>
      <label>Código<input name="codigo" placeholder="Ej. CAL" required maxLength={40} /></label>
      <label>Docente (opcional)<input name="docente" maxLength={100} /></label>
      <Feedback state={state} />
      <button className="button secondary" disabled={pending}>{pending ? 'Guardando…' : 'Guardar materia'}</button>
    </form>
  )
}

export function ArchivarMateriaForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(archivarMateria, {})
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="text-button" disabled={pending}>{pending ? 'Archivando…' : 'Archivar'}</button>
      <Feedback state={state} />
    </form>
  )
}

export function EstadoForm({ tarea }: { tarea: Tarea }) {
  const [state, action, pending] = useActionState(cambiarEstado, {})
  const completada = tarea.estado === 'completada'
  return (
    <form action={action}>
      <input type="hidden" name="id" value={tarea.id} />
      <input type="hidden" name="estado" value={completada ? 'pendiente' : 'completada'} />
      <button className="text-button" disabled={pending}>
        {pending ? 'Guardando…' : completada ? 'Reabrir' : 'Marcar completada'}
      </button>
      <Feedback state={state} />
    </form>
  )
}

export function TareaForm({ materias, fechaMinima, tarea }: {
  materias: Materia[]; fechaMinima: string; tarea?: Tarea
}) {
  const [state, action, pending] = useActionState(guardarTarea.bind(null, tarea?.id ?? null), {})
  const [titulo, setTitulo] = useState(tarea?.titulo ?? '')
  const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? '')
  const [materia, setMateria] = useState(tarea?.materia_id ?? '')
  const [fecha, setFecha] = useState(tarea?.fecha_limite ?? '')
  const [prioridad, setPrioridad] = useState<string>(tarea?.prioridad ?? 'media')
  const opciones = materias.filter(item => !item.archivada || item.id === tarea?.materia_id)

  return (
    <form action={action} className="field-stack">
      <label>Título<input name="titulo" value={titulo} onChange={event => setTitulo(event.target.value)} required maxLength={160} /></label>
      <label>Descripción (opcional)<textarea name="descripcion" value={descripcion}
        onChange={event => setDescripcion(event.target.value)} rows={3} maxLength={2000} /></label>
      <label>Tiempo estimado (minutos)<input type="number" name="minutos" min={1} max={1440} defaultValue={tarea?.minutos ?? ''} /></label>
      <div className="field-row">
        <label>Materia<select name="materia_id" value={materia} onChange={event => setMateria(event.target.value)} required>
          <option value="" disabled>Selecciona una materia</option>
          {opciones.map(item => <option key={item.id} value={item.id}>{item.nombre}{item.archivada ? ' (archivada)' : ''}</option>)}
        </select></label>
        <label>Fecha límite<input name="fecha_limite" type="date" value={fecha}
          onChange={event => setFecha(event.target.value)} min={fechaMinima} required /></label>
        <label>Prioridad<select name="prioridad" value={prioridad} onChange={event => setPrioridad(event.target.value)}>
          {prioridades.map(item => <option key={item} value={item}>{item}</option>)}
        </select></label>
      </div>
      <Feedback state={state} />
      <button className="button" disabled={pending}>{pending ? 'Guardando…' : tarea ? 'Guardar cambios' : 'Guardar tarea'}</button>
    </form>
  )
}
