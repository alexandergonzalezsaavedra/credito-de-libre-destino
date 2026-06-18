import { NextRequest, NextResponse } from 'next/server';
import { getApplication, saveApplication, addEvent } from '@/app/api/_lib/store';

type Params = { params: Promise<{ id: string }> };

// POST /applications/{id}/finalize
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  if (app.status !== 'en_proceso') {
    return NextResponse.json(
      { error: `No se puede finalizar una solicitud en estado "${app.status}"` },
      { status: 409 },
    );
  }

  if (!app.datosPersonales || !app.datosFinancieros || !app.simulacion?.resultado) {
    return NextResponse.json(
      { error: 'La solicitud debe tener datos personales, financieros y simulación antes de finalizar' },
      { status: 422 },
    );
  }

  try {
    const body = await req.json();
    if (body.autorizaciones !== undefined) app.autorizaciones = body.autorizaciones;

    if (
      !app.autorizaciones?.habeasData ||
      !app.autorizaciones?.terminosCondiciones ||
      !app.autorizaciones?.consultaCentrales
    ) {
      return NextResponse.json(
        { error: 'Se requieren todas las autorizaciones para finalizar' },
        { status: 422 },
      );
    }

    app.status = 'completada';
    app.pasoActual = 5;
    app.actualizadoEn = new Date().toISOString();
    saveApplication(app);
    addEvent(id, 'SOLICITUD_FINALIZADA', `${app.identidad.tipoDocumento} ${app.identidad.numeroDocumento}`);

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
