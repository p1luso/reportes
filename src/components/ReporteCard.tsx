import type { Reporte, TipoReporte } from '@/types/reporte';

const TYPE_CONFIG: Record<TipoReporte, { label: string; border: string; text: string; bg: string }> = {
  diario:    { label: 'DAILY BRIEF',   border: 'border-t-amber-400',  text: 'text-amber-400',  bg: 'bg-amber-400/10' },
  semanal:   { label: 'WEEKLY WRAP',   border: 'border-t-cyan-400',   text: 'text-cyan-400',   bg: 'bg-cyan-400/10'  },
  incidente: { label: 'BREAKING',      border: 'border-t-red-500',    text: 'text-red-500',    bg: 'bg-red-500/10'   },
  auditoria: { label: 'AUDIT REPORT',  border: 'border-t-violet-400', text: 'text-violet-400', bg: 'bg-violet-400/10'},
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
      bg-zinc-900 hover:bg-zinc-800
      transition-colors duration-200
      ${featured ? 'p-8 rounded-2xl' : 'p-5 rounded-xl'}
    `}>

      {/* Ghost number watermark */}
      <span aria-hidden className={`
        pointer-events-none absolute right-4 bottom-2 select-none font-black tabular-nums
        text-white/[0.04]
        ${featured ? 'text-[120px] leading-none' : 'text-[72px] leading-none'}
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
            <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse-dot" />
              LIVE
            </span>
          )}
        </div>
        <time className="text-[10px] text-zinc-500 shrink-0">{fecha}</time>
      </div>

      {/* Resumen */}
      <p className={`
        font-bold leading-tight text-white
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
              <span className="text-xs text-zinc-400 leading-relaxed">{punto}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer */}
      {reporte.links_fuente.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 pt-3 border-t border-zinc-800 mt-auto`}>
          {reporte.links_fuente.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                truncate max-w-[180px] rounded px-2 py-1
                text-[10px] font-medium tracking-wide uppercase
                ${cfg.bg} ${cfg.text} hover:opacity-80 transition-opacity
              `}
            >
              {link.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
