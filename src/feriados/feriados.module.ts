import { Module } from '@nestjs/common';
import { FeriadosService } from './feriados.service';
import { FeriadosController } from './feriados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feriado } from './entities/feriado.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Feriado])],
  controllers: [FeriadosController],
  providers: [FeriadosService],
})
export class FeriadosModule {}
