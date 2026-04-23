-- ============================================================
-- Tabla principal: reportes_tecnicos
-- ============================================================
create table if not exists public.reportes_tecnicos (
  id          uuid        primary key default gen_random_uuid(),
  tipo_reporte text        not null check (tipo_reporte in ('diario', 'semanal', 'incidente', 'auditoria')),
  fecha        date        not null,
  resumen_ejecutivo text   not null,
  puntos_clave  text[]     not null default '{}',
  links_fuente  text[]     not null default '{}',
  metadata      jsonb      not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Índices
create index if not exists idx_reportes_fecha        on public.reportes_tecnicos (fecha desc);
create index if not exists idx_reportes_tipo         on public.reportes_tecnicos (tipo_reporte);
create index if not exists idx_reportes_created_at   on public.reportes_tecnicos (created_at desc);

-- Trigger: updated_at automático
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_reportes_updated_at
  before update on public.reportes_tecnicos
  for each row execute function public.set_updated_at();

-- RLS: solo el service_role puede escribir; anon puede leer (ajusta según tu auth)
alter table public.reportes_tecnicos enable row level security;

create policy "service_role full access"
  on public.reportes_tecnicos
  for all
  using  (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "anon read"
  on public.reportes_tecnicos
  for select
  using (true);
