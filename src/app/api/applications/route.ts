import { NextRequest, NextResponse } from 'next/server';
import {
  getApplications, saveApplication, addEvent,
  type Application, type ApplicationStatus,
} from '@/app/api/_lib/store';

// POST /applications — crear solicitud
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identidad, datosPersonales, utms } = body;

    if (!identidad?.tipoDocumento || !identidad?.numeroDocumento) {
      return NextResponse.json(
        { error: 'identidad.tipoDocumento e identidad.numeroDocumento son requeridos' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const app: Application = {
      id: `SOL-${Date.now()}`,
      creadoEn: now,
      actualizadoEn: now,
      pasoActual: datosPersonales ? 2 : 1,
      status: 'en_proceso',
      identidad: { ...identidad, validado: true },
      datosPersonales: datosPersonales ?? undefined,
      utms: utms ?? undefined,
    };

    saveApplication(app);
    addEvent(app.id, 'SOLICITUD_CREADA', `${identidad.tipoDocumento} ${identidad.numeroDocumento}`);

    return NextResponse.json(app, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET /applications — listar solicitudes con filtros
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const status = searchParams.get('status') as ApplicationStatus | null;
  const tipoDocumento = searchParams.get('tipoDocumento');
  const numeroDocumento = searchParams.get('numeroDocumento');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));

  let results = getApplications();

  if (status) results = results.filter(a => a.status === status);
  if (tipoDocumento) results = results.filter(a => a.identidad.tipoDocumento === tipoDocumento);
  if (numeroDocumento) results = results.filter(a => a.identidad.numeroDocumento === numeroDocumento);

  // Ordenar por fecha descendente
  results.sort((a, b) => b.creadoEn.localeCompare(a.creadoEn));

  const total = results.length;
  const data = results.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
}
