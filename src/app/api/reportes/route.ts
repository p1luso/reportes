import { NextRequest, NextResponse } from 'next/server';
import { insertReporte } from '@/lib/supabase';
import { validateReporteInput } from '@/lib/validate';
import type { ApiErrorResponse, ApiSuccessResponse, Reporte } from '@/types/reporte';

// ── Auth middleware ──────────────────────────────────────────

function checkApiKey(request: NextRequest): boolean {
  const key = request.headers.get('x-api-key');
  return key === process.env.API_SECRET_KEY;
}

// ── POST /api/reportes ───────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!checkApiKey(request)) {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Unauthorized', details: 'x-api-key inválida o ausente.' },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Bad Request', details: 'El cuerpo no es JSON válido.' },
      { status: 400 }
    );
  }

  const { data, errors } = validateReporteInput(body);
  if (errors.length > 0) {
    return NextResponse.json<ApiErrorResponse & { fields: typeof errors }>(
      { error: 'Validation Error', details: errors.map(e => `${e.field}: ${e.message}`).join(' | '), fields: errors },
      { status: 422 }
    );
  }

  try {
    const reporte = await insertReporte(data!);
    return NextResponse.json<ApiSuccessResponse<Reporte>>(
      { data: reporte, message: 'Reporte creado correctamente.' },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido.';
    console.error('[POST /api/reportes]', message);
    return NextResponse.json<ApiErrorResponse>(
      { error: 'Internal Server Error', details: message },
      { status: 500 }
    );
  }
}

// ── GET /api/reportes ────────────────────────────────────────
// Endpoint ligero para health-check / paginación futura

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/reportes' });
}
