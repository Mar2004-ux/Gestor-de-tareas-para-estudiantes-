'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import type { FormState } from '@/lib/forms'
import { createClient } from '@/lib/supabase/server'
import { estados, hoyEnBogota, prioridades } from '@/lib/tareas'

const materiaSchema = z.object({
  docente: z.string().trim().max(100).optional(),
  nombre: z.string().trim().min(1, 'Ingresa el nombre de la materia.').max(120),
  codigo: z.string().trim().min(1, 'Ingresa el código de la materia.').max(40),
})
const tareaSchema = z.object({
  minutos: z.preprocess(value => value === '' || value == null ? null : value, z.coerce.number().int().min(1).max(1440).nullable()),
  materia_id: z.uuid('Selecciona una materia.'),
  titulo: z.string().trim().min(1, 'Ingresa un título.').max(160),
  descripcion: z.string().trim().max(2000, 'La descripción supera los 2000 caracteres.'),
  fecha_limite: z.iso.date('Ingresa una fecha límite válida.'),
  prioridad: z.enum(prioridades, 'Selecciona una prioridad.'),
})

async function authenticatedClient() {
  const supabase = await createClient()
  const session = await supabase?.auth.getClaims()
  if (!supabase || !session?.data?.claims.sub) redirect('/acceso')
  return supabase
}

export async function cerrarSesion() {
  const supabase = await createClient()
  if (supabase) await supabase.auth.signOut({ scope: 'local' })
  redirect('/acceso')
}

export async function crearMateria(_state: FormState, data: FormData): Promise<FormState> {
  const supabase = await authenticatedClient()
  const materia = materiaSchema.safeParse(Object.fromEntries(data))
  if (!materia.success) return { error: materia.error.issues[0].message }

  const { error } = await supabase.from('materias').insert({ ...materia.data, docente: materia.data.docente || undefined })
  if (error?.code === '23505') return { error: 'Ya tienes una materia con ese nombre o código.' }
  if (error) return { error: 'No se pudo guardar la materia. Intenta de nuevo.' }
  revalidatePath('/tareas')
  return { message: 'Materia registrada.' }
}

export async function archivarMateria(_state: FormState, data: FormData): Promise<FormState> {
  const supabase = await authenticatedClient()
  const id = z.uuid().safeParse(data.get('id'))
  if (!id.success) return { error: 'Materia inválida.' }

  const { data: materia, error } = await supabase.from('materias')
    .update({ archivada: true }).eq('id', id.data).select('id').maybeSingle()
  if (error || !materia) return { error: 'No se pudo archivar la materia.' }
  revalidatePath('/tareas')
  return { message: 'Materia archivada.' }
}

export async function guardarTarea(id: string | null, _state: FormState, data: FormData): Promise<FormState> {
  const supabase = await authenticatedClient()
  const tarea = tareaSchema.safeParse(Object.fromEntries(data))
  if (!tarea.success) return { error: tarea.error.issues[0].message }
  let fechaCreacion = hoyEnBogota()
  let minutos: number | null | undefined = tarea.data.minutos ?? undefined

  if (id !== null) {
    if (!z.uuid().safeParse(id).success) return { error: 'Tarea inválida.' }
    const { data: actual, error } = await supabase.from('tareas')
      .select('*').eq('id', id).maybeSingle()
    if (error || !actual) return { error: 'No se encontró la tarea.' }
    fechaCreacion = actual.fecha_creacion
    if (actual.minutos != null) minutos = tarea.data.minutos
  }

  if (tarea.data.fecha_limite < fechaCreacion) return { error: 'La fecha límite no puede ser anterior a la de creación.' }
  const tabla = supabase.from('tareas')
  const cambios = { ...tarea.data, minutos }
  const consulta = id === null ? tabla.insert(cambios) : tabla.update(cambios).eq('id', id)
  const { data: guardada, error } = await consulta.select('id').maybeSingle()

  if (error?.code === '23503') return { error: 'Selecciona una materia activa disponible.' }
  if (error?.code === '23514') return { error: 'Revisa la fecha límite y los datos de la tarea.' }
  if (error || !guardada) return { error: 'No se pudo guardar la tarea. Intenta de nuevo.' }
  revalidatePath('/tareas')
  if (id === null) redirect('/tareas')
  return { message: 'Cambios guardados.' }
}

export async function cambiarEstado(_state: FormState, data: FormData): Promise<FormState> {
  const supabase = await authenticatedClient()
  const id = z.uuid().safeParse(data.get('id'))
  const estado = z.enum(estados).safeParse(data.get('estado'))
  if (!id.success || !estado.success) return { error: 'Tarea o estado inválido.' }

  const { data: tarea, error } = await supabase.from('tareas')
    .update({ estado: estado.data }).eq('id', id.data).select('id').maybeSingle()
  if (error || !tarea) return { error: 'No se pudo actualizar la tarea.' }
  revalidatePath('/tareas')
  return { message: estado.data === 'completada' ? 'Tarea completada.' : 'Tarea reabierta.' }
}
