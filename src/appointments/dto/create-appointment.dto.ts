import { IsDate, IsEnum, IsInt, IsNotEmpty } from "class-validator";
import { Estados } from "src/common/enum-estados";

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsEnum(Estados)
  state?: Estados;

  @IsInt()
  user_id: number;

  @IsInt()
  servicio_id: number;
}
