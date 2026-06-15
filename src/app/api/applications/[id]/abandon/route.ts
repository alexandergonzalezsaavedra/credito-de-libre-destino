import { NextRequest, NextResponse } from 'next/server';
import { getApplication, saveApplication, addEvent } from '@/app/api/_lib/store';

type Params = { params: Promise<{ id: string }> };

// POST /applications/{id}/abandon
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  if (app.status !== 'en_proceso') {
    return NextResponse.json(
      { error: `No se puede abandonar una solicitud en estado "${app.status}"` },
      { status: 409 },
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const motivo: string | undefined = body?.motivo;

    app.status = 'abandonada';
    app.actualizadoEn = new Date().toISOString();
    saveApplication(app);
    addEvent(id, 'SOLICITUD_ABANDONADA', motivo ?? `en paso ${app.pasoActual}`);

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
