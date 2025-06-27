import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  // @UseGuards(AuthGuard)
  create(@Body() createAppointmentDto: CreateAppointmentDto,  @Req() req) {
    // const isSameUser = createAppointmentDto.user_uuid === req.user.uuid;
    
    // if (!isSameUser){throw new UnauthorizedException('No podés crear turnos para otros usuarios');}
    
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }


  @Patch(':uuid')
  update(@Param('uuid') uuid: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(uuid, updateAppointmentDto);
  }

  @Delete(':uuid')
  async remove(@Param('uuid') uuid: string, @Req() req) {
  //   const turno = await this.appointmentsService.findOne(uuid);

  //   const isOwner = turno.user.uuid === req.user.uuid;
  //   const isAdmin = req.user.rol === 'admin'
    
  //   if (!isOwner && !isAdmin){throw new UnauthorizedException('No podés borrar turnos de otros usuarios');}
  
    return this.appointmentsService.softDelete(uuid);
  }
}
