import type { Reporte, TipoReporte } from '@/types/reporte';

const TYPE_CONFIG: Record<TipoReporte, { label: string; border: string; text: string; tag: string }> = {
  diario:    { label: 'DAILY BRIEF',  border: 'border-t-amber-400',  text: 'text-amber-600',  tag: 'bg-amber-100  text-amber-700'  },
  semanal:   { label: 'WEEKLY WRAP',  border: 'border-t-cyan-500',   text: 'text-cyan-700',   tag: 'bg-cyan-100   text-cyan-800'   },
  incidente: { label: 'BREAKING',     border: 'border-t-red-500',    text: 'text-red-600',    tag: 'bg-red-100    text-red-700'    },
  auditoria: { label: 'AUDIT REPORT', border: 'border-t-violet-500', text: 'text-violet-700', tag: 'bg-violet-100 text-violet-800' },
};

interface Props {
  reporte: Reporte;
  featured?: boolean;
}

export default function ReporteCard({ reporte, featured = false }: Props) {
  const cfg = TYPE_CONFIG[reporte.tipo_reporte] ?? TYPE_CONFIG.diario;
  const isToday = reporte.fecha === new Date().toISOString().slice(0, 10);

  const fecha = new Date(reporte.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase();

  return (
    <article className={`
      relative flex flex-col gap-4 overflow-hidden
      border-t-4 ${cfg.border}
      bg-white shadow-sm hover:shadow-md
      transition-shadow duration-200
      ${featured ? 'p-8 rounded-2xl' : 'p-5 rounded-xl'}
    `}>

      {/* Ghost watermark */}
      <span aria-hidden className={`
        pointer-events-none absolute right-3 bottom-1 select-none font-black tabular-nums text-black/[0.04]
        ${featured ? 'text-[110px] leading-none' : 'text-[68px] leading-none'}
      `}>
        {reporte.id.slice(0, 4).toUpperCase()}
      </span>

      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black tracking-[0.18em] uppercase ${cfg.text}`}>
            {cfg.label}
          </span>
          {isToday && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />
              LIVE
            </span>
          )}
        </div>
        <time className="text-[10px] text-stone-400 shrink-0">{fecha}</time>
      </div>

      {/* Resumen */}
      <p className={`
        font-bold leading-tight text-zinc-900
        ${featured ? 'text-2xl line-clamp-4' : 'text-sm line-clamp-3'}
      `}>
        {reporte.resumen_ejecutivo}
      </p>

      {/* Puntos clave */}
      {reporte.puntos_clave.length > 0 && (
        <ul className={`flex flex-col gap-2 ${featured ? '' : 'hidden sm:flex'}`}>
          {reporte.puntos_clave.slice(0, featured ? 5 : 3).map((punto, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={`mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full ${cfg.text.replace('text-', 'bg-')}`} />
              <span className="text-xs text-stone-500 leading-relaxed">{punto}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Links */}
      {reporte.links_fuente.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-100 mt-auto">
          {reporte.links_fuente.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`truncate max-w-[180px] rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity ${cfg.tag}`}
            >
              {link.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
