import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadController } from './disponibilidad.controller';
import { DisponibilidadService } from './disponibilidad.service';

describe('DisponibilidadController', () => {
  let controller: DisponibilidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisponibilidadController],
      providers: [DisponibilidadService],
    }).compile();

    controller = module.get<DisponibilidadController>(DisponibilidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
