import { NextRequest, NextResponse } from 'next/server';
import { getApplication, saveApplication, addEvent } from '@/app/api/_lib/store';
import { calcularCuota, PLAZOS_VALIDOS, MONTO_MIN, MONTO_MAX } from '@/app/api/_lib/simulate';

type Params = { params: Promise<{ id: string }> };

// POST /applications/{id}/simulate-offer
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  if (app.status !== 'en_proceso') {
    return NextResponse.json(
      { error: `No se puede simular una solicitud en estado "${app.status}"` },
      { status: 409 },
    );
  }

  try {
    const body = await req.json();
    const monto = Number(body.monto);
    const plazoMeses = Number(body.plazoMeses);

    if (!monto || monto < MONTO_MIN || monto > MONTO_MAX) {
      return NextResponse.json(
        { error: `El monto debe estar entre $${MONTO_MIN.toLocaleString()} y $${MONTO_MAX.toLocaleString()}` },
        { status: 400 },
      );
    }
    if (!PLAZOS_VALIDOS.includes(plazoMeses)) {
      return NextResponse.json(
        { error: `Plazo inválido. Valores aceptados: ${PLAZOS_VALIDOS.join(', ')} meses` },
        { status: 400 },
      );
    }

    const resultado = calcularCuota(monto, plazoMeses);

    // Persiste la simulación en la solicitud
    app.simulacion = { monto: String(monto), plazoMeses: String(plazoMeses), resultado };
    app.pasoActual = Math.max(app.pasoActual, 3);
    app.actualizadoEn = new Date().toISOString();
    saveApplication(app);
    addEvent(id, 'SIMULACION_CALCULADA', `monto=${monto} plazo=${plazoMeses}`);

    return NextResponse.json({ monto, plazoMeses, ...resultado });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
