import { NextRequest, NextResponse } from 'next/server';
import { getApplication, getEvents } from '@/app/api/_lib/store';

type Params = { params: Promise<{ id: string }> };

// GET /applications/{id}/events — trazabilidad de eventos
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const app = getApplication(id);
  if (!app) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });

  const events = getEvents(id);
  return NextResponse.json({ applicationId: id, events, total: events.length });
}
