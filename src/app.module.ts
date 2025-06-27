import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { CommonModule } from './common/common.module';
import { FeriadosModule } from './feriados/feriados.module';
import { ServiciosModule } from './servicios/servicios.module';
import { DisponibilidadModule } from './disponibilidad/disponibilidad.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AppointmentsModule,
    AuthModule,
    MailModule,
    CommonModule,
    FeriadosModule,
    ServiciosModule,
    DisponibilidadModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
      ],
    }),],
  controllers: [AppController],
  providers: [AppService,
    {
  provide: APP_GUARD,
  useClass: ThrottlerGuard
}
  ],
})
export class AppModule { }
