import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';


@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  @Post()
  create(@Body() createDisponibilidadDto: CreateDisponibilidadDto) {
    return this.disponibilidadService.create(createDisponibilidadDto);
  }

  @Get()
  findAll() {
    return this.disponibilidadService.findAll();
  }

  @Get('/day')
  findAllByDay(@Body() createDisponibilidadDto: CreateDisponibilidadDto) {
    return this.disponibilidadService.findAllByDay(createDisponibilidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disponibilidadService.softDelete(id);
  }
}
