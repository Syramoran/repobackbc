import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
    @Get('/test') // Ruta GET /test
  testGet() {
    return { message: '¡Backend conectado correctamente! (GET)' };
  }

  @Post('/test') // Ruta POST /test
  testPost() {
    return { message: '¡Backend recibió tu POST!', timestamp: new Date() };
  }

}
