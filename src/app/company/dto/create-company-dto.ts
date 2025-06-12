import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class CreateCompanyDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @MinLength(14)
    @MaxLength(18)
    @Transform(({ value }) => value.replace(/[^\d]+/g, ''))
    cnpj: string

    @IsEmail()
    email: string
}