import { Test, TestingModule } from '@nestjs/testing';
import { DisponibilidadService } from './disponibilidad.service';

describe('DisponibilidadService', () => {
  let service: DisponibilidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisponibilidadService],
    }).compile();

    service = module.get<DisponibilidadService>(DisponibilidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
