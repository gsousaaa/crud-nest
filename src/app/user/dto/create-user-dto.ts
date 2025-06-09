import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string

    @IsStrongPassword()  
    password: string

    @IsEmail()
    email: string

}