alter table public.materias add column docente text check (length(docente) <= 100);
alter table public.tareas add column minutos integer check (minutos between 1 and 1440);
grant insert (docente) on public.materias to authenticated;
grant insert (minutos), update (minutos) on public.tareas to authenticated;
