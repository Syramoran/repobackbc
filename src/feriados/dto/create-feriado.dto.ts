import { IsBoolean, IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateFeriadoDto {
    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsBoolean()
    anual: boolean;
}
