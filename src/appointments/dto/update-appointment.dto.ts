import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Estados } from 'src/common/enum-estados';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsEnum(Estados)
  state?: Estados;
}
