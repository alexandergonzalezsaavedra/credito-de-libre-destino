import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { SimulateOfferDto } from './dto/simulate-offer.dto';
import { FinalizeApplicationDto } from './dto/finalize-application.dto';
import { AbandonApplicationDto } from './dto/abandon-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.applicationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateApplicationDto) {
    return this.applicationsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateApplicationDto) {
    return this.applicationsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): { message: string } {
    return this.applicationsService.remove(id);
  }

  @Post(':id/abandon')
  abandon(@Param('id') id: string, @Body() body: AbandonApplicationDto) {
    return this.applicationsService.abandon(id, body.motivo);
  }

  @Post(':id/simulate-offer')
  simulateOffer(@Param('id') id: string, @Body() body: SimulateOfferDto) {
    return this.applicationsService.simulateOffer(id, body);
  }

  @Post(':id/finalize')
  finalize(@Param('id') id: string, @Body() body: FinalizeApplicationDto) {
    return this.applicationsService.finalize(id, body);
  }

  @Get(':id/events')
  getEvents(@Param('id') id: string) {
    return this.applicationsService.getEvents(id);
  }
}
