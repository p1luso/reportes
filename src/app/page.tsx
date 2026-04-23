import { fetchReportes } from '@/lib/supabase';
import ReporteCard from '@/components/ReporteCard';
import EmptyState from '@/components/EmptyState';
import type { TipoReporte } from '@/types/reporte';

export const revalidate = 60;

const STATS_CONFIG: Record<TipoReporte, { label: string; color: string; ring: string }> = {
  diario:    { label: 'Daily',     color: 'text-amber-500',  ring: 'ring-amber-200'  },
  semanal:   { label: 'Weekly',    color: 'text-cyan-600',   ring: 'ring-cyan-200'   },
  incidente: { label: 'Incidents', color: 'text-red-500',    ring: 'ring-red-200'    },
  auditoria: { label: 'Audits',    color: 'text-violet-600', ring: 'ring-violet-200' },
};

const TODAY = new Date().toLocaleDateString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
}).toUpperCase();

export default async function DashboardPage() {
  const reportes = await fetchReportes(100).catch(() => []);

  const totales = reportes.reduce<Record<string, number>>(
    (acc, r) => { acc[r.tipo_reporte] = (acc[r.tipo_reporte] ?? 0) + 1; return acc; },
    {}
  );

  const [featured, ...rest] = reportes;
  const tickerItems = reportes.length > 0 ? [...reportes, ...reportes] : null;

  return (
    <div className="min-h-screen bg-stone-100 text-zinc-900 font-sans">

      {/* ── Masthead (oscuro, contraste) ── */}
      <header className="bg-zinc-950 px-6 pt-7 pb-5">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4 mb-2">
            <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase leading-none text-white">
              The Tech <span className="text-amber-400">Gazette</span>
            </h1>
            <p className="hidden sm:block text-right text-[10px] text-zinc-500 font-mono leading-relaxed">
              {TODAY}<br />
              <span className="text-zinc-600">{reportes.length} entradas · ISR 60s</span>
            </p>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em]">
            Reportes técnicos en tiempo real
          </p>
        </div>
      </header>

      {/* ── Ticker (amarillo vibrante) ── */}
      {tickerItems && (
        <div className="bg-amber-400 overflow-hidden py-2">
          <div className="flex items-center">
            <span className="shrink-0 bg-zinc-950 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 mr-4">
              LATEST
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-ticker flex whitespace-nowrap">
                {tickerItems.map((r, i) => (
                  <span key={`${r.id}-${i}`} className="flex items-center gap-3 pr-10">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                      {r.tipo_reporte}
                    </span>
                    <span className="text-xs font-medium text-zinc-900">
                      {r.resumen_ejecutivo.slice(0, 75)}{r.resumen_ejecutivo.length > 75 ? '…' : ''}
                    </span>
                    <span className="text-amber-600">◆</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8 flex flex-col gap-8">

        {/* ── Stats ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(STATS_CONFIG) as TipoReporte[]).map(tipo => {
            const cfg = STATS_CONFIG[tipo];
            return (
              <div key={tipo} className={`bg-white rounded-xl p-5 ring-1 ${cfg.ring} shadow-sm`}>
                <p className={`text-3xl font-black tabular-nums leading-none ${cfg.color}`}>
                  {totales[tipo] ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-400 mt-1.5">
                  {cfg.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* ── Contenido ── */}
        {reportes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {featured && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-stone-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Top Story</span>
                  <span className="h-px flex-1 bg-stone-300" />
                </div>
                <ReporteCard reporte={featured} featured />
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-stone-300" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">All Reports</span>
                  <span className="h-px flex-1 bg-stone-300" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map(r => <ReporteCard key={r.id} reporte={r} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-stone-200 px-6 py-5 mt-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400">The Tech Gazette</span>
          <span className="text-[10px] text-stone-300 font-mono">ISR · revalidate 60s</span>
        </div>
      </footer>
    </div>
  );
}
