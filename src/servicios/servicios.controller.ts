import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { AdminAccessGuard } from 'src/auth/guards/admin-access.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
    @UseGuards(AuthGuard,AdminAccessGuard)
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.create(createServicioDto);
  }

  @Get()
  findAll() {
    return this.serviciosService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.serviciosService.findOne(uuid);
  }

  @Patch(':uuid')
    @UseGuards(AuthGuard,AdminAccessGuard)
  update(@Param('uuid') uuid: string, @Body() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.update(uuid, updateServicioDto);
  }

  @Delete(':uuid')
    @UseGuards(AuthGuard,AdminAccessGuard)
  remove(@Param('uuid') uuid: string) {
    
    return this.serviciosService.softDelete(uuid);
  }
}
