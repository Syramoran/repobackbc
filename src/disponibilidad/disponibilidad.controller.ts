import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { AdminAccessGuard } from 'src/auth/guards/admin-access.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private readonly disponibilidadService: DisponibilidadService) {}

  @Post()
    @UseGuards(AuthGuard,AdminAccessGuard)
  create(@Body() createDisponibilidadDto: CreateDisponibilidadDto) {
    return this.disponibilidadService.create(createDisponibilidadDto);
  }

  @Get()
  findAll() {
    return this.disponibilidadService.findAll();
  }

  @Get('/day/:id')
  findAllByDay(@Param('id') id: number) {
    return this.disponibilidadService.findAllByDay(id);
  }

  @Delete(':id')
    @UseGuards(AuthGuard,AdminAccessGuard)
  remove(@Param('id') id: string) {
    return this.disponibilidadService.softDelete(id);
  }
}
