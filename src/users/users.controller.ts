import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/auth/dto/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get('appointments/:uuid')
  // @UseGuards(AuthGuard)
  // findAllAppointments(@Param('uuid') uuid: string, @Req() req){
  //   const user = req.user;
  //   if (!user.admin && user.uuid !== uuid) {
  //     throw new ForbiddenException('No tiene permiso para ver los turnos de otra persona');
  //   }

  //   return this.usersService.findAllAppointments(uuid);
  // }

  // @Get(':uuid')
  // @UseGuards(AuthGuard)
  // findOne(@Param('uuid') uuid: string, @Req() req) {
  //   const user = req.user;

  //   if (!user.admin && user.uuid !== uuid) {
  //     throw new ForbiddenException('No tiene permiso para ver este perfil');
  //   }

  //   return this.usersService.findOne(uuid);
  // }

  // @Patch(':uuid')
  // @UseGuards(AuthGuard)
  // update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    
  //   const user = req.user;

  //   if (!user.admin && user.uuid !== uuid) {
  //     throw new ForbiddenException('No tiene permiso para editar este perfil');
  //   }
    
  //   return this.usersService.update(uuid, updateUserDto);
  // }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.usersService.softDelete(uuid);
  }
}
