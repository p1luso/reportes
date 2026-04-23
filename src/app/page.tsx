import { fetchReportes } from '@/lib/supabase';
import ReporteCard from '@/components/ReporteCard';
import EmptyState from '@/components/EmptyState';
import type { TipoReporte } from '@/types/reporte';

// Revalida cada 60 s en producción (ISR)
export const revalidate = 60;

const TIPO_LABELS: Record<TipoReporte, string> = {
  diario: 'Diarios',
  semanal: 'Semanales',
  incidente: 'Incidentes',
  auditoria: 'Auditorías',
};

export default async function DashboardPage() {
  let reportes = await fetchReportes(100).catch(() => []);

  const totales = reportes.reduce<Record<string, number>>(
    (acc, r) => { acc[r.tipo_reporte] = (acc[r.tipo_reporte] ?? 0) + 1; return acc; },
    {}
  );

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight">Reportes Técnicos</span>
          </div>
          <span className="text-xs text-neutral-400">{reportes.length} registros</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* ── Stats ── */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(TIPO_LABELS) as TipoReporte[]).map(tipo => (
            <div key={tipo} className="
              rounded-xl border border-neutral-200 bg-white p-4
              dark:border-neutral-800 dark:bg-neutral-900
            ">
              <p className="text-2xl font-bold tabular-nums">{totales[tipo] ?? 0}</p>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{TIPO_LABELS[tipo]}</p>
            </div>
          ))}
        </section>

        {/* ── Grid de reportes ── */}
        <section>
          <h1 className="mb-6 text-base font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider text-xs">
            Últimos reportes
          </h1>

          {reportes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reportes.map(r => <ReporteCard key={r.id} reporte={r} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
