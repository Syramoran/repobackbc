import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disponibilidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisponibilidadDto: UpdateDisponibilidadDto) {
    return this.disponibilidadService.update(+id, updateDisponibilidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disponibilidadService.remove(+id);
  }
}
