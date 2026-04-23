import { createClient } from '@supabase/supabase-js';
import type { Reporte, ReporteInput } from '@/types/reporte';

// Lazy getters — fallan con mensaje claro si faltan las env vars en Vercel
export const supabaseAdmin = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, { auth: { persistSession: false } });
};

export const supabasePublic = () => {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  return createClient(url, key);
};

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
  const { data, error } = await supabasePublic()
    .from('reportes_tecnicos')
    .select('*')
    .order('fecha', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as Reporte[];
}
