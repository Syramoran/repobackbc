import { IsDate, IsEnum, IsInt, IsNotEmpty, IsUUID } from "class-validator";
import { Estados } from "src/common/enum-estados";

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  date: Date;

  @IsEnum(Estados)
  state?: Estados;

  @IsUUID()
  user_uuid: string

  @IsUUID()
  servicio_uuid: string
}
