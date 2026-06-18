import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: uuid(),
      tipoDocumento: 'Cédula de ciudadanía',
      numeroDocumento: '1032399835',
      nombres: 'Alexander',
      apellidos: 'Gonzalez',
      email: 'alexandergonzalezsaavedra@gmail.com',
      telefono: '3156201269',
      fechaNacimiento: '1987-11-18',
      direccion: 'Transversal 65 # 59 - 21',
      ciudad: 'Bogotá',
      solicitudes: [],
    },
    {
      id: uuid(),
      tipoDocumento: 'Cédula de ciudadanía',
      numeroDocumento: '1012396203',
      nombres: 'Diana',
      apellidos: 'Benitez Sichaca',
      email: 'sichaca1992@gmail.com',
      telefono: '3178597982',
      fechaNacimiento: '1992-10-18',
      direccion: 'Transversal 65 # 59 - 21',
      ciudad: 'Bogotá',
      solicitudes: [],
    },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOneById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuario con id '${id}' no encontrado`);
    }
    return user;
  }

  findOneByDocumento(
    tipoDocumento: string,
    numeroDocumento: string,
  ): User | undefined {
    return this.users.find(
      (u) =>
        u.tipoDocumento === tipoDocumento &&
        u.numeroDocumento === numeroDocumento,
    );
  }

  findOrCreateByDocumento(
    tipoDocumento: string,
    numeroDocumento: string,
  ): User {
    const existing = this.findOneByDocumento(tipoDocumento, numeroDocumento);
    if (existing) return existing;

    const stub: User = {
      id: uuid(),
      tipoDocumento,
      numeroDocumento,
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      fechaNacimiento: '',
      direccion: '',
      ciudad: '',
      solicitudes: [],
    };
    this.users.push(stub);
    return stub;
  }

  create(dto: CreateUserDto): User {
    const existe = this.users.find(
      (u) =>
        u.tipoDocumento === dto.tipoDocumento &&
        u.numeroDocumento === dto.numeroDocumento,
    );
    if (existe) {
      throw new ConflictException(
        `Ya existe un usuario con documento '${dto.numeroDocumento}'`,
      );
    }

    const newUser: User = {
      id: uuid(),
      ...dto,
      solicitudes: [],
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: string, dto: UpdateUserDto): User {
    const user = this.findOneById(id);

    if (dto.numeroDocumento && dto.numeroDocumento !== user.numeroDocumento) {
      const duplicate = this.users.find(
        (u) =>
          u.id !== id &&
          u.tipoDocumento === (dto.tipoDocumento ?? user.tipoDocumento) &&
          u.numeroDocumento === dto.numeroDocumento,
      );
      if (duplicate) {
        throw new ConflictException(
          `Ya existe un usuario con documento '${dto.numeroDocumento}'`,
        );
      }
    }

    Object.assign(user, dto);
    return user;
  }

  remove(id: string): { message: string } {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`Usuario con id '${id}' no encontrado`);
    }
    this.users.splice(index, 1);
    return { message: `Usuario '${id}' eliminado correctamente` };
  }
}
