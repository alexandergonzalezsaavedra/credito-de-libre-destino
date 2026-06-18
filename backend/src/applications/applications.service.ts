import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import {
  Application,
  ApplicationEvent,
  MONTO_MAX,
  MONTO_MIN,
  PLAZOS_VALIDOS,
  SimulacionResultado,
  TASA_MENSUAL,
} from './interfaces/application.interface';
import { UsersService } from '../users/users.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { SimulateOfferDto } from './dto/simulate-offer.dto';
import { FinalizeApplicationDto } from './dto/finalize-application.dto';

@Injectable()
export class ApplicationsService {
  private applications: Application[] = [];

  constructor(private readonly usersService: UsersService) {}

  findAll(userId?: string): Application[] {
    if (userId) return this.applications.filter((a) => a.userId === userId);
    return this.applications;
  }

  findOne(id: string): Application {
    const app = this.applications.find((a) => a.id === id);
    if (!app) {
      throw new NotFoundException(`Solicitud con id '${id}' no encontrada`);
    }
    return app;
  }

  create(dto: CreateApplicationDto): Application {
    const user = dto.userId
      ? this.usersService.findOneById(dto.userId)
      : this.usersService.findOrCreateByDocumento(
          dto.identidad.tipoDocumento,
          dto.identidad.numeroDocumento,
        );

    const now = new Date().toISOString();
    const app: Application = {
      id: `SOL-${uuid()}`,
      userId: dto.userId,
      status: 'en_proceso',
      pasoActual: dto.datosPersonales ? 2 : 1,
      identidad: dto.identidad,
      datosPersonales: dto.datosPersonales,
      creadoEn: now,
      actualizadoEn: now,
      eventos: [],
    };

    this.registrarEvento(app, 'SOLICITUD_CREADA', {
      tipoDocumento: dto.identidad.tipoDocumento,
      numeroDocumento: dto.identidad.numeroDocumento,
    });

    this.applications.push(app);
    user.solicitudes.push(app);

    return app;
  }

  update(id: string, dto: UpdateApplicationDto): Application {
    const app = this.findOne(id);
    this.validarEditable(app);

    Object.assign(app, {
      ...dto,
      actualizadoEn: new Date().toISOString(),
    });

    this.registrarEvento(app, 'SOLICITUD_ACTUALIZADA', {
      paso: app.pasoActual,
    });

    return app;
  }

  abandon(id: string, motivo?: string): Application {
    const app = this.findOne(id);
    if (app.status !== 'en_proceso') {
      throw new ConflictException(
        `Solo se puede abandonar una solicitud en estado 'en_proceso'`,
      );
    }

    app.status = 'abandonada';
    app.actualizadoEn = new Date().toISOString();

    this.registrarEvento(app, 'SOLICITUD_ABANDONADA', {
      motivo: motivo ?? `Abandonada en paso ${app.pasoActual}`,
    });

    return app;
  }

  simulateOffer(id: string, dto: SimulateOfferDto): Application {
    const app = this.findOne(id);
    this.validarEditable(app);

    if (dto.monto < MONTO_MIN || dto.monto > MONTO_MAX) {
      throw new BadRequestException(
        `El monto debe estar entre $${MONTO_MIN.toLocaleString()} y $${MONTO_MAX.toLocaleString()}`,
      );
    }

    if (!(PLAZOS_VALIDOS as readonly number[]).includes(dto.plazoMeses)) {
      throw new BadRequestException(
        `El plazo debe ser uno de: ${PLAZOS_VALIDOS.join(', ')} meses`,
      );
    }

    const resultado = this.calcularCuota(dto.monto, dto.plazoMeses);

    app.simulacion = {
      monto: dto.monto,
      plazoMeses: dto.plazoMeses,
      resultado,
    };
    app.pasoActual = Math.max(app.pasoActual, 3);
    app.actualizadoEn = new Date().toISOString();

    this.registrarEvento(app, 'SIMULACION_CALCULADA', {
      monto: dto.monto,
      plazoMeses: dto.plazoMeses,
      cuotaMensual: resultado.cuotaMensual,
    });

    return app;
  }

  finalize(id: string, dto: FinalizeApplicationDto): Application {
    const app = this.findOne(id);
    this.validarEditable(app);

    const autorizaciones = dto.autorizaciones ?? app.autorizaciones;

    if (!app.datosPersonales || !app.datosFinancieros || !app.simulacion?.resultado) {
      throw new UnprocessableEntityException(
        'La solicitud requiere datosPersonales, datosFinancieros y simulación para ser finalizada',
      );
    }

    if (
      !autorizaciones?.habeasData ||
      !autorizaciones?.terminosCondiciones ||
      !autorizaciones?.consultaCentrales
    ) {
      throw new UnprocessableEntityException(
        'Todas las autorizaciones son requeridas para finalizar la solicitud',
      );
    }

    app.autorizaciones = autorizaciones;
    app.status = 'completada';
    app.pasoActual = 5;
    app.actualizadoEn = new Date().toISOString();

    this.registrarEvento(app, 'SOLICITUD_FINALIZADA', {});

    return app;
  }

  remove(id: string): { message: string } {
    const app = this.findOne(id);

    if (app.status === 'completada') {
      throw new ConflictException(
        `No se puede eliminar una solicitud finalizada`,
      );
    }

    const user = this.usersService.findOneById(app.userId);
    user.solicitudes = user.solicitudes.filter((s) => s.id !== id);

    this.applications = this.applications.filter((a) => a.id !== id);

    return { message: `Solicitud '${id}' eliminada correctamente` };
  }

  getEvents(id: string): { applicationId: string; events: ApplicationEvent[]; total: number } {
    const app = this.findOne(id);
    return {
      applicationId: id,
      events: app.eventos,
      total: app.eventos.length,
    };
  }

  private validarEditable(app: Application): void {
    if (app.status !== 'en_proceso') {
      throw new ConflictException(
        `La solicitud no puede modificarse en estado '${app.status}'`,
      );
    }
  }

  private calcularCuota(monto: number, plazoMeses: number): SimulacionResultado {
    const i = TASA_MENSUAL;
    const n = plazoMeses;
    const factor = Math.pow(1 + i, n);
    const cuotaMensual = Math.round((monto * i * factor) / (factor - 1));
    const totalPagar = cuotaMensual * n;
    const totalIntereses = totalPagar - monto;
    const tasaEA = Number(((Math.pow(1 + i, 12) - 1) * 100).toFixed(2));

    return { cuotaMensual, tasaEA, totalPagar, totalIntereses };
  }

  private registrarEvento(
    app: Application,
    tipo: string,
    datos: Record<string, unknown>,
  ): void {
    app.eventos.push({ tipo, timestamp: new Date().toISOString(), datos });
  }
}
