import type { Reporte, TipoReporte } from '@/types/reporte';

const BADGE_STYLES: Record<TipoReporte, string> = {
  diario:    'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  semanal:   'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  incidente: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  auditoria: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

interface Props {
  reporte: Reporte;
}

export default function ReporteCard({ reporte }: Props) {
  const badgeClass = BADGE_STYLES[reporte.tipo_reporte] ?? BADGE_STYLES.diario;
  const fechaFormateada = new Date(reporte.fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <article className="
      group flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-6
      shadow-sm transition-shadow hover:shadow-md
      dark:border-neutral-700 dark:bg-neutral-900
    ">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
            {reporte.tipo_reporte}
          </span>
          <time className="text-sm text-neutral-500 dark:text-neutral-400">{fechaFormateada}</time>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-600 shrink-0">
          #{reporte.id.slice(0, 8)}
        </span>
      </div>

      {/* Resumen */}
      <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 line-clamp-4">
        {reporte.resumen_ejecutivo}
      </p>

      {/* Puntos clave */}
      {reporte.puntos_clave.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {reporte.puntos_clave.map((punto, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
              {punto}
            </li>
          ))}
        </ul>
      )}

      {/* Links */}
      {reporte.links_fuente.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-800">
          {reporte.links_fuente.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                truncate max-w-[200px] rounded-md px-2 py-1 text-xs
                bg-neutral-100 text-neutral-600 hover:bg-neutral-200
                dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700
                transition-colors
              "
            >
              {link.replace(/^https?:\/\//, '')}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}
