import { Transform } from "class-transformer";
import { IsEmail, IsOptional, IsString, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @IsOptional()
    number?: string;

    @Transform(({value})=>value.trim())
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}