export type TipoReporte = 'diario' | 'semanal' | 'incidente' | 'auditoria';

export interface ReporteInput {
  tipo_reporte: TipoReporte;
  fecha: string;           // ISO date string: "YYYY-MM-DD"
  resumen_ejecutivo: string;
  puntos_clave: string[];
  links_fuente: string[];
  metadata: Record<string, unknown>;
}

export interface Reporte extends ReporteInput {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
}
