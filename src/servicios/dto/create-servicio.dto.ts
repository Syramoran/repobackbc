import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateServicioDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsPositive()
    @IsInt()
    duration_min: number;

    @IsPositive()
    @IsNumber()
    price: number;
}
