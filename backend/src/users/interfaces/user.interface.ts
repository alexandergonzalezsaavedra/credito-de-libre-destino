import { Application } from '../../applications/interfaces/application.interface';

export interface User {
  id: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  direccion: string;
  ciudad: string;
  solicitudes: Application[];
}
