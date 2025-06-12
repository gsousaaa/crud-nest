import { Transform } from "class-transformer";
import { IsOptional, MaxLength, MinLength } from "class-validator";

export class UpdateCompanyDto {
    @IsOptional()
    name: string

    @IsOptional()
    @MinLength(14)
    @MaxLength(18)
    @Transform(({ value }) => value.replace(/[^\d]+/g, ''))
    cnpj: string

    @IsOptional()
    email: string
}