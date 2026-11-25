export const prioridades = ['baja', 'media', 'alta'] as const
export const estados = ['pendiente', 'completada'] as const
export const clasificaciones = ['normal', 'urgente', 'atrasada'] as const

export type Prioridad = typeof prioridades[number]
export type Estado = typeof estados[number]
export type Materia = { id: string; nombre: string; codigo: string; archivada: boolean }
export type Tarea = {
  id: string
  materia_id: string
  titulo: string
  descripcion: string
  fecha_creacion: string
  fecha_limite: string
  prioridad: Prioridad
  estado: Estado
}

export function hoyEnBogota(ahora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(ahora)
  const valor = (tipo: string) => partes.find(({ type }) => type === tipo)?.value
  return [valor('year'), valor('month'), valor('day')].join('-')
}

export function clasificar(tarea: Pick<Tarea, 'estado' | 'fecha_limite'>, hoy: string) {
  if (tarea.estado === 'completada') return null
  const dias = (Date.parse(tarea.fecha_limite) - Date.parse(hoy)) / 86_400_000
  if (dias < 0) return 'atrasada'
  return dias <= 2 ? 'urgente' : 'normal'
}

export function fechaLegible(fecha: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium', timeZone: 'UTC',
  }).format(new Date(fecha))
}
