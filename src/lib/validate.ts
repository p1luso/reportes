import type { ReporteInput, TipoReporte } from '@/types/reporte';

const TIPOS_VALIDOS: TipoReporte[] = ['diario', 'semanal', 'incidente', 'auditoria'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateReporteInput(body: unknown): {
  data: ReporteInput | null;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (typeof body !== 'object' || body === null) {
    return { data: null, errors: [{ field: 'body', message: 'El cuerpo debe ser un objeto JSON.' }] };
  }

  const b = body as Record<string, unknown>;

  if (!b.tipo_reporte || !TIPOS_VALIDOS.includes(b.tipo_reporte as TipoReporte)) {
    errors.push({ field: 'tipo_reporte', message: `Debe ser uno de: ${TIPOS_VALIDOS.join(', ')}.` });
  }

  if (!b.fecha || typeof b.fecha !== 'string' || !DATE_RE.test(b.fecha)) {
    errors.push({ field: 'fecha', message: 'Debe ser una fecha en formato YYYY-MM-DD.' });
  }

  if (!b.resumen_ejecutivo || typeof b.resumen_ejecutivo !== 'string' || b.resumen_ejecutivo.trim().length < 10) {
    errors.push({ field: 'resumen_ejecutivo', message: 'Mínimo 10 caracteres.' });
  }

  if (!Array.isArray(b.puntos_clave) || b.puntos_clave.some(p => typeof p !== 'string')) {
    errors.push({ field: 'puntos_clave', message: 'Debe ser un array de strings.' });
  }

  if (!Array.isArray(b.links_fuente) || b.links_fuente.some(l => typeof l !== 'string')) {
    errors.push({ field: 'links_fuente', message: 'Debe ser un array de strings.' });
  }

  if (b.metadata !== undefined && (typeof b.metadata !== 'object' || Array.isArray(b.metadata))) {
    errors.push({ field: 'metadata', message: 'Debe ser un objeto JSON.' });
  }

  if (errors.length > 0) return { data: null, errors };

  return {
    data: {
      tipo_reporte: b.tipo_reporte as TipoReporte,
      fecha: b.fecha as string,
      resumen_ejecutivo: (b.resumen_ejecutivo as string).trim(),
      puntos_clave: b.puntos_clave as string[],
      links_fuente: b.links_fuente as string[],
      metadata: (b.metadata ?? {}) as Record<string, unknown>,
    },
    errors: [],
  };
}
