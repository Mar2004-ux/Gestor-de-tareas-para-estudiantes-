import './studio.css'
import { Agenda, type Filters } from './agenda'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { hoyEnBogota, type Materia, type Tarea } from '@/lib/tareas'



export const dynamic = 'force-dynamic'



export default async function TasksPage({ searchParams }: { searchParams: Promise<Filters> }) {
  const supabase = await createClient()
  const session = await supabase?.auth.getClaims()
  if (!supabase || !session?.data?.claims.sub) redirect('/acceso')

  const filtros = await searchParams
  const hoy = hoyEnBogota()
  const [materiasResult, tareasResult] = await Promise.all([
    supabase.from('materias').select('*').order('nombre'),
    supabase.from('tareas').select('*')
      .order('fecha_limite').order('id'),
  ])
  const materias: Materia[] = materiasResult.data ?? []
  const tareas: Tarea[] = (tareasResult.data ?? []) as Tarea[]
  return <Agenda filtros={filtros} materias={materias} tareas={tareas} hoy={hoy} error={Boolean(materiasResult.error || tareasResult.error)} />
}
