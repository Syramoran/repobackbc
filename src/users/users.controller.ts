import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/dto/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CanAccessUserGuard } from 'src/auth/guards/can-access.guard';
import { AdminAccessGuard } from 'src/auth/guards/admin-access.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard, AdminAccessGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('appointments/:uuid')
  @UseGuards(AuthGuard, CanAccessUserGuard)
  findAllAppointments(@Param('uuid') uuid: string, @Req() req) {
    // const user = req.user;
    // if (!user.admin && user.uuid !== uuid) {
    //   throw new ForbiddenException('No tiene permiso para ver los turnos de otra persona');
    // }

    return this.usersService.findAllAppointments(uuid);
  }

  @Get(':uuid')
  @UseGuards(AuthGuard, CanAccessUserGuard)
  findOne(@Param('uuid') uuid: string, @Req() req) {
    return this.usersService.findOne(uuid);
  }

  @Patch(':uuid')
  @UseGuards(AuthGuard, CanAccessUserGuard)
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {

    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @UseGuards(AuthGuard, AdminAccessGuard)
  remove(@Param('uuid') uuid: string) {
    return this.usersService.softDelete(uuid);
  }
}
