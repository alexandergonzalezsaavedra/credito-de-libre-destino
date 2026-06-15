import { NextRequest, NextResponse } from 'next/server';
import { getApplication, saveApplication, addEvent } from '@/app/api/_lib/store';

type Params = { params: Promise<{ id: string }> };

// GET /applications/{id} — consultar detalle
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
  return NextResponse.json(app);
}

// PATCH /applications/{id} — actualizar datos
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  if (app.status === 'completada' || app.status === 'abandonada') {
    return NextResponse.json(
      { error: `No se puede modificar una solicitud en estado "${app.status}"` },
      { status: 409 },
    );
  }

  try {
    const body = await req.json();
    const { datosPersonales, datosFinancieros, simulacion, autorizaciones, pasoActual } = body;

    if (datosPersonales !== undefined) app.datosPersonales = datosPersonales;
    if (datosFinancieros !== undefined) app.datosFinancieros = datosFinancieros;
    if (simulacion !== undefined) app.simulacion = simulacion;
    if (autorizaciones !== undefined) app.autorizaciones = autorizaciones;
    if (typeof pasoActual === 'number') app.pasoActual = pasoActual;

    app.actualizadoEn = new Date().toISOString();
    saveApplication(app);
    addEvent(id, 'SOLICITUD_ACTUALIZADA', `paso ${app.pasoActual}`);

    return NextResponse.json(app);
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
