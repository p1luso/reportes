import { fetchReportes } from '@/lib/supabase';
import ReporteCard from '@/components/ReporteCard';
import EmptyState from '@/components/EmptyState';
import type { TipoReporte } from '@/types/reporte';

export const revalidate = 60;

const STATS_CONFIG: Record<TipoReporte, { label: string; color: string }> = {
  diario:    { label: 'Daily',     color: 'text-amber-400'  },
  semanal:   { label: 'Weekly',    color: 'text-cyan-400'   },
  incidente: { label: 'Incidents', color: 'text-red-500'    },
  auditoria: { label: 'Audits',    color: 'text-violet-400' },
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

  // Ticker: duplicate content so the loop is seamless
  const tickerItems = reportes.length > 0
    ? [...reportes, ...reportes]
    : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">

      {/* ── Masthead ── */}
      <header className="border-b-2 border-white/10 px-6 pt-8 pb-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4 mb-1">
            <h1 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] uppercase leading-none">
              The Tech<br className="sm:hidden" />{' '}
              <span className="text-amber-400">Gazette</span>
            </h1>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em]">Edición digital</p>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{TODAY}</p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.25em] mt-2">
            Reportes técnicos en tiempo real — {reportes.length} entradas totales
          </p>
        </div>
      </header>

      {/* ── Ticker ── */}
      {tickerItems && (
        <div className="border-b border-zinc-800 bg-zinc-900 overflow-hidden py-2.5">
          <div className="flex items-center gap-0">
            <span className="shrink-0 bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 mr-4">
              LATEST
            </span>
            <div className="overflow-hidden flex-1">
              <div className="animate-ticker flex gap-0 whitespace-nowrap">
                {tickerItems.map((r, i) => (
                  <span key={`${r.id}-${i}`} className="flex items-center gap-3 pr-12">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {r.tipo_reporte}
                    </span>
                    <span className="text-xs text-zinc-300">
                      {r.resumen_ejecutivo.slice(0, 80)}{r.resumen_ejecutivo.length > 80 ? '…' : ''}
                    </span>
                    <span className="text-zinc-700">◆</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8 flex flex-col gap-8">

        {/* ── Stats bar ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
          {(Object.keys(STATS_CONFIG) as TipoReporte[]).map(tipo => {
            const cfg = STATS_CONFIG[tipo];
            return (
              <div key={tipo} className="bg-zinc-950 px-5 py-4">
                <p className={`text-3xl font-black tabular-nums leading-none ${cfg.color}`}>
                  {totales[tipo] ?? 0}
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 mt-1.5">
                  {cfg.label}
                </p>
              </div>
            );
          })}
        </section>

        {/* ── Content ── */}
        {reportes.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-zinc-800" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                    Top Story
                  </span>
                  <span className="h-px flex-1 bg-zinc-800" />
                </div>
                <ReporteCard reporte={featured} featured />
              </section>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-px flex-1 bg-zinc-800" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                    All Reports
                  </span>
                  <span className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map(r => <ReporteCard key={r.id} reporte={r} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-900 px-6 py-6 mt-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-700">
            The Tech Gazette
          </span>
          <span className="text-[10px] text-zinc-700 font-mono">
            ISR · revalidate 60s
          </span>
        </div>
      </footer>
    </div>
  );
}
