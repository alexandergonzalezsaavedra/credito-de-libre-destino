import sesionesReducer, {
  guardarSolicitudEnSesion,
  SesionesState,
  SolicitudSesion,
} from './sesionesSlice';
import type { UsuarioPerfil } from '../usuario/usuarioSlice';

const usuario: UsuarioPerfil = {
  tipoDocumento: 'CC',
  numeroDocumento: '1234567890',
  nombres: 'Ana',
  apellidos: 'Gómez',
  email: 'ana@mail.com',
  telefono: '3001234567',
  fechaNacimiento: '1990-01-15',
  direccion: 'Calle 10 # 5-20',
  ciudad: 'Bogotá',
};

const solicitud: SolicitudSesion = {
  id: 'SOL-001',
  fecha: '2026-06-16T10:00:00.000Z',
  paso: 5,
  status: 'completada',
  tipoDocumento: 'CC',
  numeroDocumento: '1234567890',
  monto: '5000000',
  plazoMeses: '24',
  cuotaMensual: 240000,
  totalPagar: 5760000,
  tasaEA: 18.5,
};

describe('sesionesSlice — consulta de solicitudes', () => {
  it('registra la solicitud y crea la sesión del usuario cuando aún no existe', () => {
    const estadoInicial: SesionesState = { sesiones: [] };

    const resultado = sesionesReducer(
      estadoInicial,
      guardarSolicitudEnSesion({ usuario, solicitud }),
    );

    expect(resultado.sesiones).toHaveLength(1);
    expect(resultado.sesiones[0].solicitudes).toHaveLength(1);
    expect(resultado.sesiones[0].solicitudes[0].id).toBe('SOL-001');
    expect(resultado.sesiones[0].solicitudes[0].status).toBe('completada');
    expect(resultado.sesiones[0].solicitudes[0].cuotaMensual).toBe(240000);
  });

  it('actualiza una solicitud existente sin generar duplicados', () => {
    const estadoInicial: SesionesState = {
      sesiones: [{ usuario, solicitudes: [solicitud] }],
    };
    const solicitudModificada: SolicitudSesion = {
      ...solicitud,
      cuotaMensual: 260000,
      totalPagar: 6240000,
    };

    const resultado = sesionesReducer(
      estadoInicial,
      guardarSolicitudEnSesion({ usuario, solicitud: solicitudModificada }),
    );

    expect(resultado.sesiones[0].solicitudes).toHaveLength(1);
    expect(resultado.sesiones[0].solicitudes[0].cuotaMensual).toBe(260000);
    expect(resultado.sesiones[0].solicitudes[0].totalPagar).toBe(6240000);
  });
});
