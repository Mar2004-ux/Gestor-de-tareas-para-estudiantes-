create table public.materias (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nombre text not null check (char_length(btrim(nombre)) between 1 and 120),
  codigo text not null check (char_length(btrim(codigo)) between 1 and 40),
  archivada boolean not null default false,
  unique (usuario_id, id)
);

create unique index materias_nombre_por_usuario
  on public.materias (usuario_id, lower(btrim(nombre)));
create unique index materias_codigo_por_usuario
  on public.materias (usuario_id, lower(btrim(codigo)));

create table public.tareas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  materia_id uuid not null,
  titulo text not null check (char_length(btrim(titulo)) between 1 and 160),
  descripcion text not null default '' check (char_length(descripcion) <= 2000),
  fecha_creacion date not null default ((now() at time zone 'America/Bogota')::date),
  fecha_limite date not null check (fecha_limite >= fecha_creacion),
  prioridad text not null check (prioridad in ('baja', 'media', 'alta')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'completada')),
  foreign key (usuario_id, materia_id) references public.materias (usuario_id, id)
);

create index tareas_por_usuario_y_fecha on public.tareas (usuario_id, fecha_limite, id);
create index tareas_por_materia on public.tareas (usuario_id, materia_id);

alter table public.materias enable row level security;
alter table public.tareas enable row level security;

revoke all on public.materias, public.tareas from anon, authenticated;
grant select on public.materias, public.tareas to authenticated;
grant insert (nombre, codigo), update (archivada) on public.materias to authenticated;
grant insert (materia_id, titulo, descripcion, fecha_limite, prioridad),
      update (materia_id, titulo, descripcion, fecha_limite, prioridad, estado)
  on public.tareas to authenticated;

create policy materias_por_usuario on public.materias to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

create policy tareas_por_usuario on public.tareas to authenticated
  using ((select auth.uid()) = usuario_id)
  with check ((select auth.uid()) = usuario_id);

create function public.verificar_materia_activa() returns trigger
language plpgsql set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    if new.materia_id = old.materia_id then return new; end if;
  end if;

  perform 1 from public.materias
    where id = new.materia_id and usuario_id = new.usuario_id and not archivada
    for share;

  if not found then
    raise exception using errcode = '23503', message = 'La materia no está disponible';
  end if;
  return new;
end;
$$;

create trigger tareas_materia_activa
  before insert or update of materia_id on public.tareas
  for each row execute function public.verificar_materia_activa();
