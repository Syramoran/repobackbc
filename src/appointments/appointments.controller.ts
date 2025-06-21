import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
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
  remove(@Param('uuid') uuid: string) {
    return this.appointmentsService.remove(uuid);
  }
}
