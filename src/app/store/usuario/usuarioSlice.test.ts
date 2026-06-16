import usuarioReducer, {
  guardarPerfil,
  cargarPerfil,
  cerrarSesion,
} from './usuarioSlice';
import type { UsuarioPerfil } from './usuarioSlice';

const perfilCompleto: UsuarioPerfil = {
  tipoDocumento: 'CC',
  numeroDocumento: '9876543210',
  nombres: 'Carlos',
  apellidos: 'Martínez',
  email: 'carlos@mail.com',
  telefono: '3119876543',
  fechaNacimiento: '1985-07-20',
  direccion: 'Carrera 7 # 32-15',
  ciudad: 'Medellín',
};

describe('usuarioSlice — edición de datos del usuario', () => {
  it('guardarPerfil persiste todos los campos del perfil en el estado', () => {
    const estadoInicial = usuarioReducer(undefined, { type: '@@INIT' });

    const resultado = usuarioReducer(estadoInicial, guardarPerfil(perfilCompleto));

    expect(resultado.nombres).toBe('Carlos');
    expect(resultado.apellidos).toBe('Martínez');
    expect(resultado.email).toBe('carlos@mail.com');
    expect(resultado.ciudad).toBe('Medellín');
    expect(resultado.numeroDocumento).toBe('9876543210');
  });

  it('cargarPerfil actualiza solo los campos indicados sin afectar el resto', () => {
    const estadoConPerfil = usuarioReducer(undefined, guardarPerfil(perfilCompleto));

    const resultado = usuarioReducer(
      estadoConPerfil,
      cargarPerfil({ direccion: 'Av. El Poblado # 1-20', ciudad: 'Cali' }),
    );

    expect(resultado.direccion).toBe('Av. El Poblado # 1-20');
    expect(resultado.ciudad).toBe('Cali');
    expect(resultado.nombres).toBe('Carlos');
    expect(resultado.email).toBe('carlos@mail.com');
  });
});
