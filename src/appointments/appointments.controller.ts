import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, UnauthorizedException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CanAccessUserGuard } from 'src/auth/guards/can-access.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin-access.guard';
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  @UseGuards(AuthGuard, CanAccessUserGuard)
  create(@Body() createAppointmentDto: CreateAppointmentDto,  @Req() req) {
    
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
    @UseGuards(AuthGuard,AdminAccessGuard)
  findAll() {
    return this.appointmentsService.findAll();
  }


  @Patch(':uuid')
    @UseGuards(AuthGuard, CanAccessUserGuard)
  update(@Param('uuid') uuid: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentsService.update(uuid, updateAppointmentDto);
  }

  @Delete(':uuid')
    @UseGuards(AuthGuard, CanAccessUserGuard)
  async remove(@Param('uuid') uuid: string, @Req() req) {
    return this.appointmentsService.softDelete(uuid);
  }
}
