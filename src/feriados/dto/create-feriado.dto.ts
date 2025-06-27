import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class CreateFeriadoDto {
    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    anual: boolean;
}
