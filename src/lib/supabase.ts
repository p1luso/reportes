import { createClient } from '@supabase/supabase-js';
import type { Reporte, ReporteInput } from '@/types/reporte';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');

// Server-only client con service_role (para escritura desde la API)
export const supabaseAdmin = () => {
  if (!supabaseServiceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
};

// Client público para lecturas desde el browser / SSR
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// ── Queries ─────────────────────────────────────────────────

export async function insertReporte(payload: ReporteInput): Promise<Reporte> {
  const { data, error } = await supabaseAdmin()
    .from('reportes_tecnicos')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Reporte;
}

export async function fetchReportes(limit = 50): Promise<Reporte[]> {
  const { data, error } = await supabasePublic
    .from('reportes_tecnicos')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as Reporte[];
}
