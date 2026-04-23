import type { ReporteInput, TipoReporte } from '@/types/reporte';

const TIPOS_VALIDOS = new Set<string>(['diario', 'semanal', 'incidente', 'auditoria']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ValidationError {
  field: string;
  message: string;
}

// Normaliza cualquier tipo desconocido a 'diario'.
// El campo metadata.tipo_original preserva el valor enviado para trazabilidad.
function normalizeTipo(raw: unknown): TipoReporte {
  if (typeof raw === 'string' && TIPOS_VALIDOS.has(raw)) {
    return raw as TipoReporte;
  }
  return 'diario';
}

export function validateReporteInput(body: unknown): {
  data: ReporteInput | null;
  errors: ValidationError[];
} {
  const errors: ValidationError[] = [];

  if (typeof body !== 'object' || body === null) {
    return { data: null, errors: [{ field: 'body', message: 'El cuerpo debe ser un objeto JSON.' }] };
  }

  // Extraemos solo los campos conocidos; el resto se ignora silenciosamente
  const b = body as Record<string, unknown>;

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

  const rawMetadata = b.metadata;
  if (rawMetadata !== undefined && (typeof rawMetadata !== 'object' || Array.isArray(rawMetadata))) {
    errors.push({ field: 'metadata', message: 'Debe ser un objeto JSON.' });
  }

  if (errors.length > 0) return { data: null, errors };

  const tipoOriginal = b.tipo_reporte;
  const tipoNormalizado = normalizeTipo(tipoOriginal);

  // Si el tipo fue desconocido, lo registramos en metadata para no perder info
  const metadataBase = (typeof rawMetadata === 'object' && rawMetadata !== null)
    ? (rawMetadata as Record<string, unknown>)
    : {};

  const metadata: Record<string, unknown> = {
    ...metadataBase,
    ...(tipoNormalizado === 'diario' && tipoOriginal !== 'diario'
      ? { tipo_original: tipoOriginal }
      : {}),
  };

  return {
    data: {
      tipo_reporte: tipoNormalizado,
      fecha: b.fecha as string,
      resumen_ejecutivo: (b.resumen_ejecutivo as string).trim(),
      puntos_clave: b.puntos_clave as string[],
      links_fuente: b.links_fuente as string[],
      metadata,
    },
    errors: [],
  };
}
