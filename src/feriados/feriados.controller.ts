import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { CreateFeriadoDto } from './dto/create-feriado.dto';
import { UpdateFeriadoDto } from './dto/update-feriado.dto';
import { AdminAccessGuard } from 'src/auth/guards/admin-access.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('feriados')
export class FeriadosController {
  constructor(private readonly feriadosService: FeriadosService) {}

  @Post()
    @UseGuards(AuthGuard,AdminAccessGuard)
  create(@Body() createFeriadoDto: CreateFeriadoDto) {
    return this.feriadosService.create(createFeriadoDto);
  }

  @Get()
  findAll() {
    return this.feriadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feriadosService.findOne(+id);
  }

  @Patch(':id')
    @UseGuards(AuthGuard,AdminAccessGuard)
  update(@Param('id') id: string, @Body() updateFeriadoDto: UpdateFeriadoDto) {
    return this.feriadosService.update(+id, updateFeriadoDto);
  }

  @Delete(':id')
    @UseGuards(AuthGuard,AdminAccessGuard)
  remove(@Param('id') id: string) {
    return this.feriadosService.softDelete(+id);
  }
}
