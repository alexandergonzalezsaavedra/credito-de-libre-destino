export class CreateApplicationDto {
  userId?: string;
  identidad: {
    tipoDocumento: string;
    numeroDocumento: string;
  };
  datosPersonales?: {
    nombres: string;
    apellidos: string;
    email: string;
    telefono: string;
    fechaNacimiento: string;
    direccion: string;
    ciudad: string;
  };
}
