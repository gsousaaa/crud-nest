import { IsEmail, IsOptional, IsStrongPassword } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    username?: string

    @IsOptional()
    @IsStrongPassword()
    password?: string

    @IsOptional()
    @IsEmail()
    email?: string

}