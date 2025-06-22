import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Estados } from "src/common/enum-estados";

export class CreateAppointmentDto {
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  @IsEnum(Estados)
  state?: Estados;

  @IsUUID()
  user_uuid: string

  @IsUUID()
  servicio_uuid: string

  @IsOptional()
  @IsString()
  detalle?: string;
}
