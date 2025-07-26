import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { CommonModule } from "./common/common.module";
import { FeriadosModule } from "./feriados/feriados.module";
import { ServiciosModule } from "./servicios/servicios.module";
import { DisponibilidadModule } from "./disponibilidad/disponibilidad.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import config from "./config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      load: [config],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('nodeEnv') === 'development';

        if (isDev) {
          const db = configService.get('db');
          return {
            type: 'postgres',
            host: db.host,
            port: db.port,
            username: db.username,
            password: db.password,
            database: db.database,
            autoLoadEntities: true,
            synchronize: true,
          };
        } else {
          return {
            type: 'postgres',
            url: configService.get<string>('mysqlUrl'),
            autoLoadEntities: true,
            synchronize: true,
          };
        }
      },
    }),

    // 🔹 Módulos de tu app
    UsersModule,
    AppointmentsModule,
    AuthModule,
    MailModule,
    CommonModule,
    FeriadosModule,
    ServiciosModule,
    DisponibilidadModule,

    // 🔹 Throttler
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', ttl: 1000, limit: 3 },
        { name: 'medium', ttl: 10000, limit: 20 },
        { name: 'long', ttl: 60000, limit: 100 },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
