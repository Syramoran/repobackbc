import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
    @Transform(({value})=>value.trim())
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @IsNotEmpty()
    number: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
