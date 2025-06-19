import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Days } from "src/common/enum-days";

export class CreateDisponibilidadDto {
    @IsEnum(Days)
    @IsNotEmpty()
    week_day: Days;

    @IsString()
    @IsNotEmpty()
    start: string;

    @IsString()
    @IsNotEmpty()
    finish: string;
}
